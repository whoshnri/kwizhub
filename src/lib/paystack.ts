
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
    console.warn("PAYSTACK_SECRET_KEY is not defined in environment variables.");
}

const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
};

// --- Interfaces ---

export interface PaystackBank {
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    active: boolean;
    is_deleted: boolean;
    country: string;
    currency: string;
    type: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaystackAccountResolve {
    account_number: string;
    account_name: string;
    bank_id?: number;
}

export interface PaystackRecipient {
    active: boolean;
    createdAt: string;
    currency: string;
    description: string | null;
    domain: string;
    email: string | null;
    id: number;
    integration: number;
    metadata: Record<string, unknown> | null;
    name: string;
    recipient_code: string;
    type: string;
    updatedAt: string;
    is_deleted: boolean;
    details: {
        authorization_code: string | null;
        account_number: string;
        account_name: string | null;
        bank_code: string;
        bank_name: string | null;
    };
}

export interface PaystackTransfer {
    integration: number;
    domain: string;
    amount: number;
    currency: string;
    source: string;
    reason: string;
    recipient: number;
    status: string;
    transfer_code: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaystackTransactionVerify {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown> | null;
    log: Record<string, unknown> | null;
    fees: number;
    fees_split: unknown;
    authorization: Record<string, unknown>;
    customer: Record<string, unknown>;
    plan: unknown;
    split: unknown;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: unknown;
    source: unknown;
    fees_breakdown: unknown;
    transaction_date: string;
    plan_object: unknown;
    subaccount: unknown;
}

interface PaystackResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

// --- API Functions ---

export async function listBanks(): Promise<PaystackResponse<PaystackBank[]>> {
    try {
        const response = await fetch(`${PAYSTACK_BASE_URL}/bank?currency=NGN`, {
            method: 'GET',
            headers,
            cache: 'no-store'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `Paystack Error: ${response.statusText}`);
        return data as PaystackResponse<PaystackBank[]>;
    } catch (error) {
        console.error("Paystack listBanks error:", error);
        return { status: false, message: "Failed to list banks", data: [] };
    }
}

export async function resolveAccount(accountNumber: string, bankCode: string): Promise<PaystackResponse<PaystackAccountResolve>> {
    try {
        const response = await fetch(`${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
            method: 'GET',
            headers,
            cache: 'no-store'
        });
        const data = await response.json();
        // Paystack resolve can fail with 422 if account invalid, handled here
        if (!response.ok) {
            return { status: false, message: data.message || "Account resolution failed", data: {} as any };
        }
        return data as PaystackResponse<PaystackAccountResolve>;
    } catch (error) {
        console.error("Paystack resolveAccount error:", error);
        return { status: false, message: "Failed to resolve account", data: {} as any };
    }
}

export async function createTransferRecipient(name: string, accountNumber: string, bankCode: string): Promise<PaystackResponse<PaystackRecipient>> {
    try {
        const body = {
            type: "nuban",
            name: name,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: "NGN"
        };

        const response = await fetch(`${PAYSTACK_BASE_URL}/transferrecipient`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            cache: 'no-store'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to create recipient");
        return data as PaystackResponse<PaystackRecipient>;
    } catch (error) {
        console.error("Paystack createTransferRecipient error:", error);
        throw error; // Let caller handle
    }
}

export async function initiateTransfer(amount: number, recipientCode: string, reference?: string, reason?: string): Promise<PaystackResponse<PaystackTransfer>> {
    try {
        const body = {
            source: "balance",
            amount: amount,
            recipient: recipientCode,
            reason: reason || "Withdrawal",
            reference: reference
        };

        const response = await fetch(`${PAYSTACK_BASE_URL}/transfer`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            cache: 'no-store'
        });
        const data = await response.json();
        if (!response.ok) return { status: false, message: data.message || "Transfer failed", data: {} as any };
        return data as PaystackResponse<PaystackTransfer>;
    } catch (error) {
        console.error("Paystack initiateTransfer error:", error);
        return { status: false, message: "Transfer exception", data: {} as any };
    }
}

export async function verifyTransaction(reference: string): Promise<PaystackResponse<PaystackTransactionVerify>> {
    try {
        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
            method: 'GET',
            headers,
            cache: 'no-store'
        });
        const data = await response.json();
        if (!response.ok) return { status: false, message: data.message || "Verification failed", data: {} as any };
        return data as PaystackResponse<PaystackTransactionVerify>;
    } catch (error) {
        console.error("Paystack verifyTransaction error:", error);
        return { status: false, message: "Verification exception", data: {} as any };
    }
}
