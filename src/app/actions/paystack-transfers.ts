"use server";

import { listBanks, resolveAccount, createTransferRecipient, initiateTransfer, PaystackBank } from "@/lib/paystack";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

export type ActionResult<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
};

// 1. Get Banks
export async function getPaystackBanks(): Promise<ActionResult<PaystackBank[]>> {
    try {
        const response = await listBanks();
        if (response.status) {
            return { success: true, message: "Banks fetched", data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch banks" };
    } catch (error) {
        console.error("Error fetching banks:", error);
        return { success: false, message: "Internal server error fetching banks" };
    }
}

// 2. Resolve Account (with balance check)
export async function verifyWithdrawalAccount(
    amount: number,
    accountNumber: string,
    bankCode: string
): Promise<ActionResult<{ accountName: string; bankName: string }>> {
    try {
        const session = await getAdminSession();
        if (!session) return { success: false, message: "Unauthorized" };

        const adminId = session.id;

        // Check balance first
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            include: { wallet: true },
        });

        if (!admin || !admin.wallet) {
            return { success: false, message: "Wallet not found" };
        }

        const pendingWithdrawals = await prisma.withdrawal.aggregate({
            where: { adminId: adminId, status: "PENDING" },
            _sum: { amount: true }
        });
        const pendingAmount = pendingWithdrawals._sum.amount || 0;
        const availableBalance = admin.wallet.balance - pendingAmount;

        if (availableBalance < amount) {
            return { success: false, message: "Insufficient balance for this withdrawal" };
        }

        // Fetch bank name to return to UI
        const banksRes = await listBanks();
        const bankName = banksRes.status ? banksRes.data.find(b => b.code === bankCode)?.name || bankCode : bankCode;

        // Resolve account
        const response = await resolveAccount(accountNumber, bankCode);
        if (response.status) {
            return {
                success: true,
                message: "Account resolved",
                data: {
                    accountName: response.data.account_name,
                    bankName: bankName
                }
            };
        }
        return { success: false, message: response.message || "Could not resolve account details. Please check the number and bank." };
    } catch (error) {
        console.error("Error resolving account:", error);
        return { success: false, message: "Unable to verify account details at this time" };
    }
}

// 3. Initiate Transfer
export async function initiatePaystackTransfer(
    amount: number,
    accountName: string,
    accountNumber: string,
    bankCode: string,
    bankNameArg?: string
): Promise<ActionResult<{ reference: string }>> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const adminId = session.id;
        const bankName = bankNameArg || bankCode;

        // 1. Create Recipient Code (Paystack)
        const recipientRes = await createTransferRecipient(accountName, accountNumber, bankCode);
        if (!recipientRes.status) {
            return { success: false, message: "Failed to create transfer recipient: " + recipientRes.message };
        }
        const recipientCode = recipientRes.data.recipient_code;

        const reference = `W-${uuidv4()}`;
        const amountKobo = Math.round(amount * 100);
        let withdrawalId: string | null = null;

        // 2. Deduct from Wallet & Record PENDING Withdrawal (DB Transaction)
        try {
            withdrawalId = await prisma.$transaction(async (tx) => {
                const admin = await tx.admin.findUnique({
                    where: { id: adminId },
                    include: { wallet: true }
                });
                if (!admin || !admin.wallet) throw new Error("Wallet not found");

                const pendingWithdrawals = await tx.withdrawal.aggregate({
                    where: { adminId: adminId, status: "PENDING" },
                    _sum: { amount: true }
                });
                const pendingAmount = pendingWithdrawals._sum.amount || 0;
                const availableBalance = admin.wallet.balance - pendingAmount;

                if (availableBalance < amount) {
                    throw new Error("Insufficient wallet balance");
                }

                // Create Withdrawal Record (No immediate deduction)
                const withdrawal = await tx.withdrawal.create({
                    data: {
                        amount: amount,
                        status: "PENDING",
                        reference: reference,
                        adminId: adminId,
                        bankName: bankName,
                        accountName: accountName,
                        accountNo: accountNumber,
                    }
                });

                return withdrawal.id;
            });
        } catch (dbError) {
            console.error("DB Deduction Error:", dbError);
            return { success: false, message: dbError instanceof Error ? dbError.message : "Database transaction failed (Wallet deduction)" };
        }

        if (!withdrawalId) return { success: false, message: "Failed to prepare withdrawal in database" };

        // 3. Initiate Transfer (Paystack)
        const transferRes = await initiateTransfer(amountKobo, recipientCode, reference, "KwizHub Withdrawal");
        console.dir(transferRes);

        if (!transferRes.status) {
            // 4. Immediate Failure - Refund happens implicitly by webhook or we can reverse it now.
            // Since it failed instantly (e.g. invalid recipient, paystack down), the webhook might not fire.
            // Let's do a manual refund to be safe.
            await prisma.withdrawal.update({
                where: { id: withdrawalId! },
                data: { status: "REJECTED" }
            });

            return { success: false, message: "Transfer initiation failed: " + transferRes.message };
        }

        // Success - It is now PENDING and we wait for the webhook.
        // We return the reference so the frontend can connect to SSE.
        return {
            success: true,
            message: "Transfer initiated successfully. Waiting for confirmation...",
            data: { reference }
        };

    } catch (error) {
        console.error("Initiate Transfer Error:", error);
        return { success: false, message: "An unexpected error occurred during transfer initiation." };
    }
}
