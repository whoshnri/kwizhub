"use server";

import prisma from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { createOrderSchema, CreateOrderInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";


export async function getUserOrders() {
    const session = await getUserSession();
    if (!session) return [];

    try {
        return await prisma.order.findMany({
            where: { userId: session.id },
            include: {
                material: {
                    select: { name: true, course: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Database error in getUserOrders:", error);
        return [];
    }
}

export async function getUserPurchasedMaterials() {
    const session = await getUserSession();
    if (!session) return [];

    try {
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
    } catch (error) {
        console.error("Database error in getUserPurchasedMaterials:", error);
        return [];
    }
}
