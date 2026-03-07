"use server";

import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import {
    approveWithdrawalSchema,
    ApproveWithdrawalInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./auth";


export async function approveWithdrawal(
    input: ApproveWithdrawalInput
): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const validated = approveWithdrawalSchema.parse(input);

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: validated.id },
            include: { admin: { include: { wallet: true } } },
        });

        if (!withdrawal) {
            return { success: false, message: "Withdrawal not found" };
        }

        // Only the same admin can manage their withdrawals
        if (withdrawal.adminId !== session.id) {
            return { success: false, message: "Not authorized" };
        }

        if (withdrawal.status !== "PENDING") {
            return { success: false, message: "Withdrawal already processed" };
        }

        if (validated.status === "APPROVED" || validated.status === "PAID") {
            if (!withdrawal.admin.wallet) return { success: false, message: "Wallet not initialized" };

            // Check if admin still has enough balance
            if (withdrawal.admin.wallet.balance < withdrawal.amount) {
                return { success: false, message: "Insufficient wallet balance" };
            }

            // Deduct from wallet and update status
            await prisma.$transaction([
                prisma.wallet.update({
                    where: { adminId: withdrawal.adminId },
                    data: { balance: { decrement: withdrawal.amount } },
                }),
                prisma.withdrawal.update({
                    where: { id: validated.id },
                    data: { status: validated.status },
                }),
                prisma.transaction.create({
                    data: {
                        type: "WITHDRAWAL",
                        amount: withdrawal.amount,
                        description: `Withdrawal approved: ${withdrawal.reference}`,
                        adminId: withdrawal.adminId,
                    }
                })
            ]);
        } else {
            // Just update status (REJECTED)
            await prisma.withdrawal.update({
                where: { id: validated.id },
                data: { status: validated.status },
            });
        }

        revalidatePath("/admin/withdrawals");
        revalidatePath("/admin");

        return { success: true, message: `Withdrawal ${validated.status.toLowerCase()}` };
    } catch (error) {
        console.error("Approve withdrawal error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function getAdminWithdrawals() {
    const session = await getAdminSession();
    if (!session) return [];

    try {
        return await prisma.withdrawal.findMany({
            where: { adminId: session.id },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Database error in getAdminWithdrawals:", error);
        return [];
    }
}

export async function getAdminOrders() {
    const session = await getAdminSession();
    if (!session) return [];

    try {
        return await prisma.order.findMany({
            where: { adminId: session.id },
            include: {
                material: { select: { name: true, course: true } },
                user: { select: { username: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Database error in getAdminOrders:", error);
        return [];
    }
}

export async function getAdminMaterials() {
    const session = await getAdminSession();
    if (!session) return [];

    try {
        return await prisma.material.findMany({
            where: { adminId: session.id },
            include: {
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Database error in getAdminMaterials:", error);
        return [];
    }
}

export async function getAdminStats() {
    const session = await getAdminSession();
    if (!session) return null;

    try {
        const admin = await prisma.admin.findUnique({
            where: { id: session.id },
            include: {
                wallet: true,
                _count: {
                    select: {
                        materials: true,
                        orders: true,
                    },
                },
            },
        });

        if (!admin) return null;

        const totalEarnings = await prisma.transaction.aggregate({
            where: {
                adminId: session.id,
                type: { in: ["SALE", "REFERRAL_COMMISSION", "EQUITY_PAYMENT"] }
            },
            _sum: { amount: true },
        });

        const pendingWithdrawals = await prisma.withdrawal.aggregate({
            where: { adminId: session.id, status: "PENDING" },
            _sum: { amount: true },
        });

        return {
            wallet: admin.wallet?.balance ?? 0,
            totalEarnings: totalEarnings._sum.amount ?? 0,
            totalMaterials: admin._count.materials,
            totalOrders: admin._count.orders,
            pendingWithdrawals: pendingWithdrawals._sum.amount ?? 0,
        };
    } catch (error) {
        console.error("Database error in getAdminStats:", error);
        return {
            wallet: 0,
            totalEarnings: 0,
            totalMaterials: 0,
            totalOrders: 0,
            pendingWithdrawals: 0,
        };
    }
}

export async function getMaterialEarnings() {
    const session = await getAdminSession();
    if (!session) return [];

    try {
        const materials = await prisma.material.findMany({
            where: { adminId: session.id },
            include: {
                orders: {
                    where: { status: "COMPLETED" },
                    select: { amount: true },
                },
            },
        });

        return materials.map((material) => ({
            id: material.id,
            name: material.name,
            course: material.course,
            totalEarnings: material.orders.reduce((sum, order) => sum + order.amount, 0),
            salesCount: material.orders.length,
        }));
    } catch (error) {
        console.error("Database error in getMaterialEarnings:", error);
        return [];
    }
}
