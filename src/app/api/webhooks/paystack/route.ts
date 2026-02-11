import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { completePurchase, processRefund, completeWithdrawal } from "@/lib/billing";
import { notifyPaymentStatus } from "@/lib/payment-events";

export async function POST(req: NextRequest) {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            console.error("[Webhook] PAYSTACK_SECRET_KEY not set");
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        const body = await req.json();
        const signature = req.headers.get("x-paystack-signature");

        if (!signature) {
            return NextResponse.json({ message: "No signature provided" }, { status: 400 });
        }

        const hash = crypto
            .createHmac("sha512", secret)
            .update(JSON.stringify(body))
            .digest("hex");

        if (hash !== signature) {
            console.error("[Webhook] Invalid Paystack Signature");
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        const event = body.event;
        const data = body.data;

        console.log(`[Webhook] Received event: ${event}, ref: ${data.reference}`);

        if (event === "charge.success") {
            const reference = data.reference;
            const externalId = data.id?.toString();
            const result = await completePurchase(reference, externalId);

            // Notify SSE listeners so the frontend updates in real-time
            const orderId = result.data && typeof result.data === "object" && "orderId" in result.data
                ? (result.data as { orderId: string }).orderId
                : undefined;
            notifyPaymentStatus(reference, {
                success: result.success,
                message: result.message,
                orderId,
            });
            console.log(`[Webhook] charge.success processed for ${reference}: ${result.success ? "OK" : "FAIL"} - ${result.message}`);

        } else if (event === "transfer.success") {
            const reference = data.reference;
            const externalId = data.id?.toString();
            const result = await completeWithdrawal(reference, externalId);
            console.log(`[Webhook] transfer.success processed for ${reference}: ${result.message}`);

        } else if (event === "transfer.failed" || event === "transfer.reversed") {
            const reference = data.reference;
            const reason = data.reason || event;
            const result = await processRefund(reference, reason);
            console.log(`[Webhook] ${event} processed for ${reference}: ${result.message}`);
        }

        return NextResponse.json({ message: "Webhook processed" }, { status: 200 });

    } catch (error) {
        console.error("[Webhook] Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
