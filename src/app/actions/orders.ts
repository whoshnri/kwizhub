"use server";

import prisma from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { createOrderSchema, CreateOrderInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import type { ActionResult } from "./auth";

function generatePaymentRef(): string {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `PAY-KH-${num}`;
}

export async function createOrder(
    input: CreateOrderInput
): Promise<ActionResult<{ orderId: string }>> {
    try {
        const session = await getUserSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const validated = createOrderSchema.parse(input);

        // Get material with admin
        const material = await prisma.material.findUnique({
            where: { id: validated.materialId, isPublished: true },
            include: { admin: true },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        // Check if user already owns this material
        const existingOwnership = await prisma.user.findFirst({
            where: {
                id: session.id,
                materials: { some: { id: material.id } },
            },
        });

        if (existingOwnership) {
            return { success: false, message: "You already own this material" };
        }

        // Generate payment reference
        let paymentRef = generatePaymentRef();
        while (await prisma.order.findUnique({ where: { paymentRef } })) {
            paymentRef = generatePaymentRef();
        }

        // Check referral code if provided
        let referralCommission = 0;
        let referrerId: string | null = null;
        let referralCodeId: string | null = null;

        if (input.referralCode) {
            const code = await prisma.referralCode.findUnique({
                where: { code: input.referralCode },
                include: { referrer: true }
            });

            // "make sure if the coupon doesnt exist fr the material then it doesnt apply"
            // We check if code exists AND matches material. 
            // NOTE: Current schema links referral code to material. 
            // If code.materialId == material.id.

            if (code && code.materialId === material.id) {
                referrerId = code.referrerId;
                referralCodeId = code.id;
                // Use material's configured referral percentage
                // "add a new feild for the author to specify the referall earnings per product"
                // "then if successful... price is split 80 - 10 (referrer gets 20%)" (Example)
                const percentage = material.referralPercentage || 0;
                referralCommission = (material.price * percentage) / 100;
            }
        }

        // Create order and update wallet in transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    amount: material.price,
                    status: "COMPLETED",
                    paymentRef,
                    userId: session.id,
                    adminId: material.adminId, // Primary owner on the order record
                    materialId: material.id,
                },
            });

            // Handle splits
            let remainingAmount = material.price;

            // 1. Referral Commission
            if (referrerId && referralCommission > 0) {
                await tx.transaction.create({
                    data: {
                        type: "REFERRAL_COMMISSION",
                        amount: referralCommission,
                        description: `Referral earnings on ${material.name}`,
                        adminId: referrerId,
                        orderId: newOrder.id,
                        materialId: material.id
                    }
                });

                await tx.admin.update({
                    where: { id: referrerId },
                    data: { wallet: { increment: referralCommission } }
                });

                remainingAmount -= referralCommission;

                // Update usage count
                if (referralCodeId) {
                    await tx.referralCode.update({
                        where: { id: referralCodeId },
                        data: { usageCount: { increment: 1 } }
                    });
                }
            }

            // 2. Co-author Equity
            if (material.coAuthorId && material.coAuthorAccepted && material.equityPercentage) {
                const coAuthorShare = (remainingAmount * material.equityPercentage) / 100;

                await tx.transaction.create({
                    data: {
                        type: "EQUITY_PAYMENT",
                        amount: coAuthorShare,
                        description: `Equity share on ${material.name} (${material.equityPercentage}%)`,
                        adminId: material.coAuthorId,
                        orderId: newOrder.id,
                        materialId: material.id
                    }
                });

                await tx.admin.update({
                    where: { id: material.coAuthorId },
                    data: { wallet: { increment: coAuthorShare } }
                });

                remainingAmount -= coAuthorShare;
                // Does equity apply to the WHOLE price or post-referral?
                // "split the earnings by equity"
                // Usually equity is on Net Revenue (Price - Fees - Commissions).
                // So (Remaining * Equity) is correct.
            }

            // 3. Primary Admin (Remainder)
            if (remainingAmount > 0) {
                await tx.transaction.create({
                    data: {
                        type: "SALE",
                        amount: remainingAmount,
                        description: `Payment for ${material.name}`,
                        adminId: material.adminId,
                        orderId: newOrder.id,
                        materialId: material.id
                    }
                });

                await tx.admin.update({
                    where: { id: material.adminId },
                    data: { wallet: { increment: remainingAmount } },
                });
            }

            // Link material to user
            await tx.user.update({
                where: { id: session.id },
                data: {
                    materials: { connect: { id: material.id } },
                },
            });

            return newOrder;
        });

        revalidatePath("/user/materials");
        revalidatePath("/user/transactions");
        revalidatePath("/admin");

        return {
            success: true,
            message: "Purchase successful!",
            data: { orderId: order.id },
        };
    } catch (error) {
        console.error("Create order error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function getUserOrders() {
    const session = await getUserSession();
    if (!session) return [];

    return prisma.order.findMany({
        where: { userId: session.id },
        include: {
            material: {
                select: { name: true, course: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getUserPurchasedMaterials() {
    const session = await getUserSession();
    if (!session) return [];

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
            materials: {
                include: {
                    admin: {
                        select: { name: true },
                    },
                },
            },
        },
    });

    return user?.materials ?? [];
}
