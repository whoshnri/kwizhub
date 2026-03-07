"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/constants";
import { getPaystackBanks, verifyWithdrawalAccount, initiatePaystackTransfer } from "@/app/actions/paystack-transfers";
import { PaystackBank } from "@/lib/paystack";

type FormStep = "INPUT" | "VERIFYING" | "CONFIRM" | "PROCESSING" | "SUCCESS";

export function WithdrawalForm({
    walletBalance,
    onSuccess,
}: {
    walletBalance: number;
    onSuccess?: () => void;
}) {
    const router = useRouter();
    const [step, setStep] = useState<FormStep>("INPUT");

    // Form State
    const [amount, setAmount] = useState<string>("");
    const [bankCode, setBankCode] = useState<string>("");
    const [accountNo, setAccountNo] = useState<string>("");

    // Fetched Data
    const [banks, setBanks] = useState<PaystackBank[]>([]);
    const [resolvedName, setResolvedName] = useState<string>("");
    const [resolvedBankName, setResolvedBankName] = useState<string>("");
    const [transferReference, setTransferReference] = useState<string>("");

    // Load Banks on Mount
    useEffect(() => {
        let mounted = true;
        const loadBanks = async () => {
            const res = await getPaystackBanks();
            if (res.success && res.data && mounted) {
                // Sort banks alphabetically
                const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setBanks(sorted);
            } else if (!res.success && mounted) {
                toast.error("Failed to load banks");
            }
        };
        loadBanks();
        return () => { mounted = false; };
    }, []);

    // SSE Effect for Processing State
    useEffect(() => {
        if (step !== "PROCESSING" || !transferReference) return;

        console.log("Connecting to SSE for transfer status:", transferReference);
        const eventSource = new EventSource(`/api/payment-status/${transferReference}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("SSE Event:", data);

            if (data.type === "payment_status") {
                eventSource.close();
                if (data.success) {
                    toast.success(data.message || "Transfer completed successfully!");
                    setStep("SUCCESS");
                    router.refresh(); // Refresh balance and table
                } else {
                    toast.error(data.message || "Transfer failed.");
                    setStep("INPUT"); // Go back to let them try again
                }
            } else if (data.type === "timeout") {
                eventSource.close();
                router.refresh();
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
            router.refresh();
        };

        return () => {
            eventSource.close();
        };
    }, [step, transferReference, router]);


    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < MIN_WITHDRAWAL_AMOUNT) {
            toast.error(`Minimum withdrawal is ₦${MIN_WITHDRAWAL_AMOUNT}`);
            return;
        }

        if (numAmount > walletBalance) {
            toast.error("Insufficient balance");
            return;
        }

        if (!bankCode) {
            toast.error("Please select a bank");
            return;
        }

        if (accountNo.length !== 10) {
            toast.error("Account number must be 10 digits");
            return;
        }

        setStep("VERIFYING");

        const res = await verifyWithdrawalAccount(numAmount, accountNo, bankCode);

        if (res.success && res.data) {
            setResolvedName(res.data.accountName);
            setResolvedBankName(res.data.bankName);
            setStep("CONFIRM");
        } else {
            toast.error(res.message);
            setStep("INPUT");
        }
    };

    const handleConfirm = async () => {
        setStep("PROCESSING");

        const numAmount = parseFloat(amount);
        const res = await initiatePaystackTransfer(
            numAmount,
            resolvedName,
            accountNo,
            bankCode,
            resolvedBankName
        );

        if (res.success && res.data) {
            setTransferReference(res.data.reference);
            // The SSE effect will now take over
        } else {
            toast.error(res.message);
            setStep("CONFIRM"); // Let them re-try or cancel
        }
    };


    // Render specific views based on step
    if (step === "VERIFYING") {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Verifying account details...</p>
            </div>
        );
    }

    if (step === "CONFIRM") {
        return (
            <div className="space-y-6 py-4">
                <div className="rounded-lg border p-4 space-y-3 bg-card shadow-sm">
                    <h3 className="font-semibold text-lg border-b pb-2">Confirm Transfer Details</h3>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium text-right font-mono">₦{parseFloat(amount).toLocaleString()}</span>

                        <span className="text-muted-foreground">Bank:</span>
                        <span className="font-medium text-right">{resolvedBankName}</span>

                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-medium text-right font-mono">{accountNo}</span>

                        <span className="text-muted-foreground">Account Name:</span>
                        <span className="font-bold text-right text-primary">{resolvedName}</span>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-4">
                    <Button variant="outline" className="w-full py-6" onClick={() => setStep("INPUT")}>
                        Edit Details
                    </Button>
                    <Button className="w-full py-6" onClick={handleConfirm}>
                        Initiate Transfer
                    </Button>
                </div>
            </div>
        );
    }

    if (step === "PROCESSING") {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <Info className="h-16 w-16 text-blue-500 mb-2" />
                <h3 className="text-2xl font-bold">Transfer Processing</h3>
                <p className="text-muted-foreground mb-6">
                    Your withdrawal request has been submitted and is currently processing. You may close this window and check your dashboard later for the status.
                </p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setStep("INPUT");
                        setAmount("");
                        setAccountNo("");
                        if (onSuccess) onSuccess();
                    }}
                >
                    Done
                </Button>
            </div>
        );
    }

    if (step === "SUCCESS") {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                <h3 className="text-2xl font-bold">Transfer Successful</h3>
                <p className="text-muted-foreground mb-6">
                    ₦{parseFloat(amount).toLocaleString()} has been sent to your bank account.
                </p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setStep("INPUT");
                        setAmount("");
                        setAccountNo("");
                        if (onSuccess) onSuccess();
                    }}
                >
                    Done
                </Button>
            </div>
        );
    }

    // Default INPUT Step
    return (
        <form onSubmit={handleVerify} className="space-y-4 py-4 mt-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                    id="amount"
                    type="number"
                    min={MIN_WITHDRAWAL_AMOUNT}
                    max={walletBalance}
                    step="100"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: ₦{MIN_WITHDRAWAL_AMOUNT.toLocaleString()}</span>
                    <span>Max: ₦{walletBalance.toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bank">Select Bank</Label>
                <Select value={bankCode} onValueChange={setBankCode} required>
                    <SelectTrigger id="bank" className="w-full">
                        <SelectValue placeholder={banks.length === 0 ? "Loading banks..." : "Select your bank"} />
                    </SelectTrigger>
                    <SelectContent>
                        {banks.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                                {bank.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="accountNo">Account Number (10 digits)</Label>
                <Input
                    id="accountNo"
                    placeholder="e.g., 0123456789"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={walletBalance < MIN_WITHDRAWAL_AMOUNT || banks.length === 0}>
                Continue
            </Button>
        </form>
    );
}
