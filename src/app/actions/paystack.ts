"use server";

import { listBanks, resolveAccount, createTransferRecipient, initiateTransfer, PaystackBank, PaystackAccountResolve } from "@/lib/paystack";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { completePurchase, processRefund } from "@/lib/billing";

export type ActionResult<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
};

// --- Helper Data Fetching ---

export async function getPaystackBanks(): Promise<ActionResult<{ name: string, code: string }[]>> {
    try {
        const response = await listBanks();
        const bankList: PaystackBank[] = response.data;
        if (response.status) {
            return {
                success: true, message: "Banks fetched", data: bankList.map((bank) => ({
                    name: bank.name,
                    code: bank.code,
                }))
            };
        }
        return { success: false, message: response.message || "Failed to fetch banks" };
    } catch (error) {
        console.error("Error fetching banks:", error);
        return { success: false, message: "Internal server error fetching banks" };
    }
}

export async function verifyBankAccount(accountNumber: string, bankCode: string): Promise<ActionResult<PaystackAccountResolve>> {
    try {
        const response = await resolveAccount(accountNumber, bankCode);
        if (response.status) {
            return { success: true, message: "Account resolved", data: response.data };
        }
        return { success: false, message: response.message || "Could not resolve account" };
    } catch (error) {
        console.error("Error resolving account:", error);
        return { success: false, message: "Unabled to resolve account details" };
    }
}

// --- Withdrawal Logic ---

export async function processWithdrawal(amount: number, bankCode: string, accountNumber: string, accountName: string): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const adminId = session.id;

        // 1. Create Recipient Code (Paystack) - Safe to do first
        const recipientRes = await createTransferRecipient(accountName, accountNumber, bankCode);
        if (!recipientRes.status) {
            return { success: false, message: "Failed to create transfer recipient: " + recipientRes.message };
        }
        const recipientCode = recipientRes.data.recipient_code;

        const reference = `W-${uuidv4()}`;
        const amountKobo = Math.round(amount * 100);
        let withdrawalId: string | null = null;

        // 2. Deduct from Wallet & Record PENDING Withdrawal (DB Transaction)
        // We do this BEFORE initiating transfer to prevent double-spending if DB update fails after transfer.
        try {
            withdrawalId = await prisma.$transaction(async (tx) => {
                const admin = await tx.admin.findUnique({
                    where: { id: adminId },
                    include: { wallet: true }
                });
                if (!admin) throw new Error("Admin not found");
                if (!admin.wallet) throw new Error("Wallet not found");

                if (admin.wallet.balance < amount) {
                    throw new Error("Insufficient wallet balance");
                }

                // Deduct Wallet
                await tx.wallet.update({
                    where: { adminId: adminId },
                    data: { balance: { decrement: amount } }
                });

                // Create Withdrawal Record
                const withdrawal = await tx.withdrawal.create({
                    data: {
                        amount: amount,
                        status: "PENDING", // Initially pending
                        reference: reference,
                        adminId: adminId,
                        bankName: accountName, // Using account name as bank name placeholder if needed
                        accountName: accountName,
                        accountNo: accountNumber,
                    }
                });

                // Create Transaction Record
                await tx.transaction.create({
                    data: {
                        type: "WITHDRAWAL",
                        amount: amount,
                        description: `Withdrawal to ${accountNumber}`,
                        adminId: adminId,
                    }
                });

                return withdrawal.id;
            });
        } catch (dbError) {
            console.error("DB Deduction Error:", dbError);
            return { success: false, message: dbError instanceof Error ? dbError.message : "Database transaction failed" };
        }

        if (!withdrawalId) return { success: false, message: "Failed to prepare withdrawal" };

        // 3. Initiate Transfer (Paystack)
        const transferRes = await initiateTransfer(amountKobo, recipientCode, reference, "KwizHub Withdrawal");
        console.dir(transferRes); // Keep user's debug log

        if (!transferRes.status) {
            // 4a. Failure - Refund Wallet
            console.error("Transfer failed, refunding wallet...");
            await processRefund(reference, transferRes.message || "Transfer initiation failed");
            return { success: false, message: "Transfer initiation failed: " + transferRes.message };
        }

        // 4b. Success - (Optional: Update status to QUEUED if we want, or leave PENDING)
        // Paystack transfers are async. PENDING is fine until webhook updates it.
        // Or we can set to "SUCCESS" if instant? Usually "success" or "pending" response.

        revalidatePath("/admin");
        return { success: true, message: "Withdrawal initiated successfully" };

    } catch (error) {
        console.error("Withdrawal Error:", error);
        return { success: false, message: "Withdrawal processing failed" };
    }
}
// Overload or fix signature for bankName support if needed:
// Ideally the UI passes the Bank Name it displayed.
// I will start with just bankCode in the DB or update signature now. 
// Let's update signature to include bankName.

// --- Purchase Verification ---

export async function verifyPurchase(reference: string): Promise<ActionResult> {
    return await completePurchase(reference);
}
