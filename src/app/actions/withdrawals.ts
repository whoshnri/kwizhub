"use server";

import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import {
    requestWithdrawalSchema,
    approveWithdrawalSchema,
    RequestWithdrawalInput,
    ApproveWithdrawalInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./auth";

function generateWithdrawalRef(): string {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `WTH-KH-${num}`;
}

export async function requestWithdrawal(
    input: RequestWithdrawalInput
): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const validated = requestWithdrawalSchema.parse(input);

        // Get admin with current wallet balance
        const admin = await prisma.admin.findUnique({
            where: { id: session.id },
        });

        if (!admin) {
            return { success: false, message: "Admin not found" };
        }

        if (admin.wallet < validated.amount) {
            return { success: false, message: "Insufficient wallet balance" };
        }

        // Generate reference
        let reference = generateWithdrawalRef();
        while (await prisma.withdrawal.findUnique({ where: { reference } })) {
            reference = generateWithdrawalRef();
        }

        // Create withdrawal request (wallet is NOT deducted yet)
        await prisma.withdrawal.create({
            data: {
                amount: validated.amount,
                status: "PENDING",
                reference,
                adminId: session.id,
                bankName: validated.bankName,
                accountName: validated.accountName,
                accountNo: validated.accountNo,
            },
        });

        revalidatePath("/admin/withdrawals");

        return { success: true, message: "Withdrawal request submitted" };
    } catch (error) {
        console.error("Request withdrawal error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

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
            include: { admin: true },
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
            // Check if admin still has enough balance
            if (withdrawal.admin.wallet < withdrawal.amount) {
                return { success: false, message: "Insufficient wallet balance" };
            }

            // Deduct from wallet and update status
            await prisma.$transaction([
                prisma.admin.update({
                    where: { id: withdrawal.adminId },
                    data: { wallet: { decrement: withdrawal.amount } },
                }),
                prisma.withdrawal.update({
                    where: { id: validated.id },
                    data: { status: validated.status },
                }),
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

    return prisma.withdrawal.findMany({
        where: { adminId: session.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAdminOrders() {
    const session = await getAdminSession();
    if (!session) return [];

    return prisma.order.findMany({
        where: { adminId: session.id },
        include: {
            material: { select: { name: true, course: true } },
            user: { select: { username: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAdminMaterials() {
    const session = await getAdminSession();
    if (!session) return [];

    return prisma.material.findMany({
        where: { adminId: session.id },
        include: {
            _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAdminStats() {
    const session = await getAdminSession();
    if (!session) return null;

    const admin = await prisma.admin.findUnique({
        where: { id: session.id },
        include: {
            _count: {
                select: {
                    materials: true,
                    orders: true,
                },
            },
        },
    });

    if (!admin) return null;

    const totalEarnings = await prisma.order.aggregate({
        where: { adminId: session.id, status: "COMPLETED" },
        _sum: { amount: true },
    });

    const pendingWithdrawals = await prisma.withdrawal.aggregate({
        where: { adminId: session.id, status: "PENDING" },
        _sum: { amount: true },
    });

    return {
        wallet: admin.wallet,
        totalEarnings: totalEarnings._sum.amount ?? 0,
        totalMaterials: admin._count.materials,
        totalOrders: admin._count.orders,
        pendingWithdrawals: pendingWithdrawals._sum.amount ?? 0,
    };
}

export async function getMaterialEarnings() {
    const session = await getAdminSession();
    if (!session) return [];

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
}
