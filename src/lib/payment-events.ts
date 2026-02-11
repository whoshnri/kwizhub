/**
 * In-memory event emitter for payment status updates.
 * Used to bridge Webhook -> SSE so the frontend knows when a payment succeeds.
 * 
 * Flow:
 * 1. Frontend opens SSE connection to /api/payment-status/[reference]
 * 2. Webhook receives charge.success, processes it, then calls notifyPaymentStatus()
 * 3. SSE endpoint picks up the event and streams it to the waiting frontend
 */

type PaymentStatusListener = (status: { success: boolean; message: string; orderId?: string }) => void;

const listeners = new Map<string, PaymentStatusListener[]>();

// Auto-cleanup timeout (30 seconds)
const LISTENER_TIMEOUT = 30_000;

export function onPaymentStatus(reference: string, callback: PaymentStatusListener) {
    if (!listeners.has(reference)) {
        listeners.set(reference, []);
    }
    listeners.get(reference)!.push(callback);

    // Auto-cleanup after timeout
    setTimeout(() => {
        removePaymentListener(reference, callback);
    }, LISTENER_TIMEOUT);
}

export function removePaymentListener(reference: string, callback: PaymentStatusListener) {
    const cbs = listeners.get(reference);
    if (cbs) {
        const idx = cbs.indexOf(callback);
        if (idx !== -1) cbs.splice(idx, 1);
        if (cbs.length === 0) listeners.delete(reference);
    }
}

export function notifyPaymentStatus(reference: string, status: { success: boolean; message: string; orderId?: string }) {
    const cbs = listeners.get(reference);
    if (cbs) {
        console.log(`[PaymentEvents] Notifying ${cbs.length} listener(s) for ref: ${reference}`);
        cbs.forEach(cb => cb(status));
        listeners.delete(reference); // One-shot: clear after notifying
    } else {
        console.log(`[PaymentEvents] No listeners for ref: ${reference}`);
    }
}
