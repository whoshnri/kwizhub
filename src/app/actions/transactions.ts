"use server";

import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { $Enums } from "@/generated/prisma/client";

export async function getAdminTransactions(filters?: {
    materialId?: string | "all";
    type?: $Enums.TransactionType | "all";
}) {
    const session = await getAdminSession();
    if (!session) return [];

    const whereClause: any = {
        adminId: session.id,
    };

    if (filters?.materialId && filters.materialId !== "all") {
        whereClause.materialId = filters.materialId;
    }

    if (filters?.type && filters.type !== "all") {
        whereClause.type = filters.type;
    }

    return prisma.transaction.findMany({
        where: whereClause,
        include: {
            material: {
                select: {
                    name: true,
                    course: true,
                },
            },
            order: {
                include: {
                    user: {
                        select: {
                            username: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
