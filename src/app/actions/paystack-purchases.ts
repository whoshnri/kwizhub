"use server";

import prisma from "@/lib/db";
import { getUserSession, getAdminSession } from "@/lib/session";
import { initializeTransaction } from "@/lib/paystack";
import { v4 as uuidv4 } from "uuid";
import type { ActionResult } from "./paystack";

function generatePaymentRef(): string {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `PAY-KH-${num}-${uuidv4().split('-')[0]}`;
}

export async function initializePurchaseTransaction(
    materialId: string,
    email: string,
    referralCode?: string
): Promise<ActionResult<{ access_code: string; reference: string }>> {
    try {
        // Authenticate - either user or admin can purchase
        let session = await getUserSession();
        if (!session) {
            const adminSession = await getAdminSession();
            if (adminSession) {
                // Technically Admin Session is different, but for buying they just need an ID
                // We fake a generic session object for the ID
                session = { id: adminSession.id, email: adminSession.email, name: adminSession.name, role: "USER" } as any;
            } else {
                return { success: false, message: "Not authenticated" };
            }
        }

        if (!session) return { success: false, message: "Not authenticated" };

        const material = await prisma.material.findUnique({
            where: { id: materialId, isPublished: true },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        if (material.price === 0) {
            return { success: false, message: "Material is free, use the free claim flow instead" };
        }

        // Validate Referral Code if provided
        if (referralCode) {
            const code = await prisma.referralCode.findUnique({
                where: { code: referralCode }
            });
            if (!code || code.materialId !== materialId) {
                // We'll just continue without the bad referral code, 
                // or we can fail the request so they know it's invalid
                return { success: false, message: "Invalid referral code for this material" };
            }
        }

        const reference = generatePaymentRef();
        const amountKobo = Math.round(material.price * 100);

        const metadata = {
            custom_fields: [
                {
                    display_name: "Material ID",
                    variable_name: "materialId",
                    value: materialId
                },
                {
                    display_name: "User ID",
                    variable_name: "userId",
                    value: session.id
                },
                {
                    display_name: "Referral Code",
                    variable_name: "referralCode",
                    value: referralCode || ""
                }
            ]
        };

        const paystackRes = await initializeTransaction(email, amountKobo, reference, metadata);

        if (!paystackRes.status) {
            return { success: false, message: "Failed to initialize payment: " + paystackRes.message };
        }

        return {
            success: true,
            message: "Payment initialized",
            data: {
                access_code: paystackRes.data.access_code,
                reference: paystackRes.data.reference
            }
        };

    } catch (error) {
        console.error("Error initializing purchase:", error);
        return { success: false, message: "Internal server error" };
    }
}
