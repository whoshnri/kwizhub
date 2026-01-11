"use server";

import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { $Enums } from "@/generated/prisma/client";

export async function getAdminTransactions(filters?: {
    materialId?: string | "all";
    type?: $Enums.TransactionType | "all";
    startDate?: string;
    endDate?: string;
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

    // Date range filtering
    if (filters?.startDate || filters?.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate) {
            whereClause.createdAt.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            // Add one day to include the entire end date
            const endDate = new Date(filters.endDate);
            endDate.setDate(endDate.getDate() + 1);
            whereClause.createdAt.lte = endDate;
        }
    }

    return prisma.transaction.findMany({
        where: whereClause,
        include: {
            material: {
                select: {
                    id: true,
                    name: true,
                    course: true,
                    courseCode: true,
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
