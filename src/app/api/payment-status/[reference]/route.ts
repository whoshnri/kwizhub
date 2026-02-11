import { NextRequest } from "next/server";
import { onPaymentStatus, removePaymentListener } from "@/lib/payment-events";

/**
 * SSE Endpoint: GET /api/payment-status/[reference]
 * 
 * The frontend connects here after Paystack popup closes.
 * It waits for the webhook to fire notifyPaymentStatus(), then streams the result.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ reference: string }> }
) {
    const { reference } = await params;

    console.log(`[SSE] Client connected for payment ref: ${reference}`);

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            // Send a heartbeat immediately so the client knows we're connected
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

            const callback = (status: { success: boolean; message: string; orderId?: string }) => {
                try {
                    console.log(`[SSE] Sending payment status for ref ${reference}:`, status);
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "payment_status", ...status })}\n\n`)
                    );
                    // Close the stream after sending the result
                    controller.close();
                } catch {
                    // Stream already closed by client
                    console.log(`[SSE] Stream already closed for ref: ${reference}`);
                }
            };

            // Register listener
            onPaymentStatus(reference, callback);

            // Timeout: close stream after 30s if no webhook arrives
            const timeout = setTimeout(() => {
                try {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "timeout", message: "Payment confirmation is taking longer than expected. Check your dashboard." })}\n\n`)
                    );
                    controller.close();
                } catch {
                    // Already closed
                }
                removePaymentListener(reference, callback);
            }, 30_000);

            // Clean up on abort (client disconnects)
            req.signal.addEventListener("abort", () => {
                clearTimeout(timeout);
                removePaymentListener(reference, callback);
                console.log(`[SSE] Client disconnected for ref: ${reference}`);
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
