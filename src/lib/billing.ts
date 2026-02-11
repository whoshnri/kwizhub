import prisma from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";

export type BillingResult = {
    success: boolean;
    message: string;
    data?: unknown;
};

/**
 * Processes a successful purchase (Charge).
 * - Verifies the transaction with Paystack (if not verified).
 * - Checks for idempotency (Order existence).
 * - Distributes funds (Admin, Co-Author, Referrer).
 * - Creates Order and Transactions.
 */
export async function completePurchase(reference: string, externalId?: string): Promise<BillingResult> {
    try {
        // 1. Check if Order already exists (Idempotency)
        const existingOrder = await prisma.order.findUnique({
            where: { paymentRef: reference }
        });

        if (existingOrder) {
            // Update external ID if missing
            if (externalId && !existingOrder.externalId) {
                await prisma.order.update({
                    where: { id: existingOrder.id },
                    data: { externalId }
                });
            }
            return { success: true, message: "Order already verified", data: { orderId: existingOrder.id } };
        }

        // 2. Verify with Paystack (Always verify source of truth)
        const verifyRes = await verifyTransaction(reference);
        if (!verifyRes.status || verifyRes.data.status !== "success") {
            return { success: false, message: "Payment verification failed" };
        }

        const amountPaidKobo = verifyRes.data.amount;
        // Verify external ID matches if provided?
        // if (externalId && verifyRes.data.id.toString() !== externalId) ...

        const rawMetadata = verifyRes.data.metadata || {};

        // Helper to find value in custom_fields or direct property
        const getMetaValue = (key: string) => {
            if (rawMetadata[key]) return rawMetadata[key];
            if (rawMetadata.custom_fields && Array.isArray(rawMetadata.custom_fields)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const field = rawMetadata.custom_fields.find((f: any) => f.variable_name === key);
                return field ? field.value : undefined;
            }
            return undefined;
        };

        const materialId = getMetaValue("materialId");
        const userId = getMetaValue("userId");
        const referralCode = getMetaValue("referralCode");

        if (!materialId) {
            return { success: false, message: "Invalid transaction data: missing materialId" };
        }

        // 3. Process Order creation and Wallet Credits
        return await prisma.$transaction(async (tx) => {
            const material = await tx.material.findUnique({ where: { id: materialId } });
            if (!material) {
                console.error(`[Billing] Material not found: ${materialId}`);
                throw new Error("Material not found");
            }
            console.log(`[Billing] Processing purchase for material: ${material.name} (${material.id})`);

            const amountPaid = amountPaidKobo / 100;

            let referralAmount = 0;
            let referrerId = null;

            if (referralCode) {
                const refCode = await tx.referralCode.findUnique({
                    where: { code: referralCode },
                    include: { referrer: true }
                });

                if (refCode && refCode.materialId === materialId) {
                    referrerId = refCode.referrerId;
                    referralAmount = (amountPaid * refCode.earningsPercentage) / 100;

                    // Credit Referrer
                    console.log(`[Billing] Crediting Referrer ${referrerId}: ${referralAmount}`);
                    await tx.wallet.upsert({
                        where: { adminId: referrerId },
                        create: { adminId: referrerId, balance: referralAmount },
                        update: { balance: { increment: referralAmount } }
                    });

                    // Log Transaction
                    await tx.transaction.create({
                        data: {
                            type: "REFERRAL_COMMISSION",
                            amount: referralAmount,
                            description: `Comm. for ${material.name}`,
                            adminId: referrerId,
                            materialId: materialId,
                        }
                    });

                    await tx.referralCode.update({
                        where: { id: refCode.id },
                        data: { usageCount: { increment: 1 } }
                    });
                }
            }

            const netAmount = amountPaid - referralAmount;

            // Co-author check
            let coAuthorAmount = 0;
            if (material.coAuthorId && material.equityPercentage) {
                coAuthorAmount = (netAmount * material.equityPercentage) / 100;

                // Credit Co-author
                console.log(`[Billing] Crediting Co-author ${material.coAuthorId}: ${coAuthorAmount}`);
                await tx.wallet.upsert({
                    where: { adminId: material.coAuthorId },
                    create: { adminId: material.coAuthorId, balance: coAuthorAmount },
                    update: { balance: { increment: coAuthorAmount } }
                });

                await tx.transaction.create({
                    data: {
                        type: "EQUITY_PAYMENT",
                        amount: coAuthorAmount,
                        description: `Equity for ${material.name}`,
                        adminId: material.coAuthorId,
                        materialId: materialId,
                    }
                });
            }

            const mainAdminAmount = netAmount - coAuthorAmount;

            // Credit Main Admin
            console.log(`[Billing] Crediting Main Admin ${material.adminId}: ${mainAdminAmount}`);
            await tx.wallet.upsert({
                where: { adminId: material.adminId },
                create: { adminId: material.adminId, balance: mainAdminAmount },
                update: { balance: { increment: mainAdminAmount } }
            });

            await tx.transaction.create({
                data: {
                    type: "SALE",
                    amount: mainAdminAmount,
                    description: `Sale of ${material.name}`,
                    adminId: material.adminId,
                    materialId: materialId,
                }
            });

            if (!userId) throw new Error("User ID missing for order");

            const order = await tx.order.create({
                data: {
                    amount: amountPaid,
                    status: "COMPLETED",
                    paymentRef: reference,
                    externalId: externalId || verifyRes.data.id.toString(), // Save external ID
                    userId: userId,
                    adminId: material.adminId,
                    materialId: material.id,
                }
            });

            // Connect material to user's downloaded materials (for user dashboard)
            await tx.user.update({
                where: { id: userId },
                data: {
                    materials: {
                        connect: { id: material.id }
                    }
                }
            });
            console.log(`[Billing] Material ${material.id} connected to user ${userId}`);

            return { success: true, message: "Purchase verified successfully", data: { orderId: order.id } };
        });

    } catch (error) {
        console.error(`[Billing] Complete Purchase Error for ref ${reference}:`, error);
        return { success: false, message: error instanceof Error ? error.message : "Verification failed" };
    }
}

/**
 * Handles a failed withdrawal (Refunds the specific withdrawal)
 */
export async function processRefund(reference: string, reason: string = "Transfer failed"): Promise<BillingResult> {
    try {
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { reference }
        });

        if (!withdrawal) {
            return { success: false, message: "Withdrawal record not found" };
        }

        if (withdrawal.status !== "PENDING") {
            // Already processed? 
            // If FAILED already, ignore.
            if (withdrawal.status === "FAILED") return { success: true, message: "Already refunded" };
            if (withdrawal.status === "PAID") {
                // Danger: Paid but now failed? Manual review needed.
                console.warn(`Withdrawal ${reference} marked PAID but received FAILURE event.`);
                return { success: false, message: "Mismatch: Withdrawal was PAID but now FAILED" };
            }
        }

        await prisma.$transaction(async (tx) => {
            // Refund Wallet
            await tx.wallet.update({
                where: { adminId: withdrawal.adminId },
                data: { balance: { increment: withdrawal.amount } }
            });

            // Mark FAILED
            await tx.withdrawal.update({
                where: { id: withdrawal.id },
                data: { status: "FAILED" } // reason not in schema
            });

            // Log REFUND
            await tx.transaction.create({
                data: {
                    type: "REFUND",
                    amount: withdrawal.amount,
                    description: `Refund: ${reason}`,
                    adminId: withdrawal.adminId,
                }
            });
        });

        return { success: true, message: "Refund processed" };
    } catch (error) {
        console.error("Process Refund Error:", error);
        return { success: false, message: "Refund failed" };
    }
}

/**
 * Marks a withdrawal as SUCCESS (PAID)
 */
export async function completeWithdrawal(reference: string, externalId?: string): Promise<BillingResult> {
    try {
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { reference }
        });

        if (!withdrawal) {
            return { success: false, message: "Withdrawal not found" };
        }

        if (withdrawal.status === "PAID") return { success: true, message: "Already paid" };

        await prisma.withdrawal.update({
            where: { id: withdrawal.id },
            data: {
                status: "PAID", // Schema uses 'paid'? Schema says 'PAID' enum string or mapping
                externalId: externalId
            }
        });

        // Note: Transaction "WITHDRAWAL" was already created at request/approval time.
        // We do NOT create another one here, just update status.

        return { success: true, message: "Withdrawal confirmed" };
    } catch (error) {
        console.error("Complete Withdrawal Error:", error);
        return { success: false, message: "Completion failed" };
    }
}
