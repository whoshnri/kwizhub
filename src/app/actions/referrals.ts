"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { z } from "zod";

const generateReferralSchema = z.object({
    materialId: z.string().uuid(),
    code: z.string().min(3).max(20).regex(/^[A-Za-z0-9-]+$/, "Alphanumeric and dashes only"),
    percentage: z.number().min(1).max(100).optional(),
});

export async function generateReferralCode(formData: FormData) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const data = {
            materialId: formData.get("materialId"),
            code: formData.get("code"),
            percentage: formData.get("percentage") ? parseFloat(formData.get("percentage") as string) : undefined,
        };

        const validated = generateReferralSchema.parse(data);

        // Check if material belongs to admin (or they are co-author?)
        // For now, let's allow co-authors to generate codes too if we want, 
        // but typically the owner controls this. 
        // Let's restrict to owner for now or check logic.

        const material = await prisma.material.findUnique({
            where: { id: validated.materialId },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        // Logic choice: Can anyone generate a referral code? 
        // The prompt said "New referral code model usable only by authors".
        // Use strict check:
        if (material.adminId !== session.id && material.coAuthorId !== session.id) {
            return { success: false, message: "You are not an author of this material" };
        }

        // Check if code exists
        const existing = await prisma.referralCode.findUnique({
            where: { code: validated.code },
        });

        if (existing) {
            return { success: false, message: "Code already taken" };
        }

        // If percentage not provided, use material default or 10
        const finalPercentage = validated.percentage || material.referralPercentage || 10;

        await prisma.referralCode.create({
            data: {
                code: validated.code.toUpperCase(),
                earningsPercentage: finalPercentage,
                materialId: validated.materialId,
                referrerId: session.id, // The one generating it gets the commission? 
                // Or are we generating it FOR someone else?
                // "New referral code model usable only by authors"
                // Usually authors generate codes for influencers.
                // But here, if the author generates it, who is the referrer?
                // If the author generates it for themselves, they get the commission + the sale?
                // Let's assume the logged-in admin is the referrer for this code. 
                // Wait, if an author generates a code for a 3rd party, they should specify the referrer.
                // But the schema `referrerId` links to `Admin`. 
                // So the referrer must be an Admin.
                // If the use case is "Authors generate codes for others", the "other" must be an Admin.
                // If the use case is "Authors generate codes for themselves to share", then referrer is self.
                // Let's stick to self for now (Simpler MVP).
            },
        });

        revalidatePath("/admin/referrals");
        return { success: true, message: "Referral code created" };

    } catch (error) {
        console.error("Generate referral error:", error);
        return { success: false, message: "Failed to generate code" };
    }
}

export async function getMyReferralCodes() {
    const session = await getAdminSession();
    if (!session) return [];

    return prisma.referralCode.findMany({
        where: { referrerId: session.id },
        include: {
            material: {
                select: {
                    name: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function deleteReferralCode(id: string) {
    const session = await getAdminSession();
    if (!session) return { success: false, message: "Unauthorized" };

    try {
        const code = await prisma.referralCode.findUnique({ where: { id } });
        if (!code || code.referrerId !== session.id) {
            return { success: false, message: "Not found or unauthorized" };
        }

        await prisma.referralCode.delete({ where: { id } });
        revalidatePath("/admin/referrals");
        return { success: true, message: "Code deleted" };
    } catch (e) {
        return { success: false, message: "Error deleting code" };
    }
}
