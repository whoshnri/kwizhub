"use server";

import prisma from "@/lib/db";

export async function getAuthors() {
    const admins = await prisma.admin.findMany({
        where: {
            materials: {
                some: { isPublished: true }
            }
        },
        select: {
            id: true,
            name: true,
            username: true,
            _count: {
                select: {
                    materials: {
                        where: { isPublished: true }
                    }
                }
            }
        },
        orderBy: { createdAt: "asc" }
    });

    return admins;
}

export async function getAuthorById(id: string) {
    const admin = await prisma.admin.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            username: true,
            createdAt: true,
            materials: {
                where: { isPublished: true },
                select: {
                    id: true,
                    name: true,
                    course: true,
                    courseCode: true,
                    price: true,
                    semester: true,
                    department: true,
                    level: true,
                    category: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" }
            },
            _count: {
                select: {
                    materials: {
                        where: { isPublished: true }
                    },
                    orders: true
                }
            }
        }
    });

    return admin;
}
