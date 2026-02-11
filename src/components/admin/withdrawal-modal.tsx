"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getPaystackBanks, verifyBankAccount, processWithdrawal } from "@/app/actions/paystack";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WithdrawalModal({
    balance,
    children
}: {
    balance: number,
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(false);

    // Form State
    const [amount, setAmount] = useState("");
    const [selectedBankCode, setSelectedBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    // Processing States
    const [resolving, setResolving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open && banks.length === 0) {
            setLoadingBanks(true);
            getPaystackBanks()
                .then((res) => {
                    if (res.success) {
                        setBanks(res.data || []);
                    } else {
                        toast.error("Failed to load banks");
                    }
                })
                .finally(() => setLoadingBanks(false));
        }
    }, [open, banks.length]);

    const handleResolveAccount = async () => {
        if (!selectedBankCode || accountNumber.length < 10) {
            toast.error("Please select a bank and enter a valid account number");
            return;
        }

        setResolving(true);
        const res = await verifyBankAccount(accountNumber, selectedBankCode);
        setResolving(false);

        if (res.success) {
            setAccountName(res.data?.account_name || "");
            toast.success("Account verified!");
        } else {
            setAccountName("");
            toast.error(res.message);
        }
    };

    const handleWithdraw = async () => {
        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            toast.error("Invalid amount");
            return;
        }
        if (withdrawAmount > balance) {
            toast.error("Insufficient balance");
            return;
        }
        if (!accountName) {
            toast.error("Please verify account details first");
            return;
        }

        setSubmitting(true);
        const res = await processWithdrawal(withdrawAmount, selectedBankCode, accountNumber, accountName);
        setSubmitting(false);

        if (res.success) {
            toast.success(res.message);
            setOpen(false);
            // Reset form
            setStep(1);
            setAmount("");
            setAccountNumber("");
            setAccountName("");
            setSelectedBankCode("");
        } else {
            toast.error(res.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                        Available Balance: <span className="font-bold text-primary">₦{balance.toLocaleString()}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Bank</Label>
                        <Select value={selectedBankCode} onValueChange={setSelectedBankCode} >
                            <SelectTrigger disabled={loadingBanks} className="w-full">
                                <SelectValue placeholder={loadingBanks ? "Loading banks..." : "Select Bank"} />
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

                    <div className="grid gap-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <div className="flex gap-2">
                            <Input
                                id="accountNumber"
                                placeholder="0123456789"
                                value={accountNumber}
                                onChange={(e) => {
                                    setAccountNumber(e.target.value);
                                    setAccountName(""); // Reset verification on change
                                }}
                            />
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleResolveAccount}
                                disabled={resolving || !accountNumber || !selectedBankCode}
                            >
                                {resolving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                            </Button>
                        </div>
                    </div>

                    {accountName && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-medium">{accountName}</span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleWithdraw}
                        disabled={submitting || !accountName || parseFloat(amount) > balance}
                        className="w-full"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Confirm Withdrawal"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
