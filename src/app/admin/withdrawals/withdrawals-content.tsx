"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { requestWithdrawal, approveWithdrawal } from "@/app/actions/withdrawals";

type Withdrawal = {
    id: string;
    amount: number;
    status: string;
    reference: string;
    createdAt: Date;
    bankName: string;
    accountName: string;
    accountNo: string;
};

export function WithdrawalsContent({
    withdrawals,
    walletBalance,
}: {
    withdrawals: Withdrawal[];
    walletBalance: number;
}) {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleRequestWithdrawal(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const result = await requestWithdrawal({
            amount: parseFloat(formData.get("amount") as string),
            bankName: formData.get("bankName") as string,
            accountName: formData.get("accountName") as string,
            accountNo: formData.get("accountNo") as string,
        });

        if (result.success) {
            toast.success(result.message);
            setDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    }

    async function handleStatusChange(id: string, status: "APPROVED" | "REJECTED" | "PAID") {
        const result = await approveWithdrawal({ id, status });
        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "PENDING":
                return "secondary";
            case "APPROVED":
                return "default";
            case "PAID":
                return "default";
            case "REJECTED":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            {/* Wallet Balance & Request */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-primary to-blue-900 text-white">
                    <CardHeader>
                        <CardDescription className="text-blue-100">Available Balance</CardDescription>
                        <CardTitle className="text-4xl">₦{walletBalance.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-100 text-sm">
                            Minimum withdrawal: ₦1,000
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Request Withdrawal</CardTitle>
                        <CardDescription>Withdraw funds to your bank account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full" disabled={walletBalance < 1000}>
                                    {walletBalance < 1000 ? "Insufficient Balance" : "Request Withdrawal"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Request Withdrawal</DialogTitle>
                                    <DialogDescription>
                                        Enter your bank details and amount
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (₦)</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            min="1000"
                                            max={walletBalance}
                                            step="100"
                                            placeholder="Enter amount"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Max: ₦{walletBalance.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bankName">Bank Name</Label>
                                        <Input
                                            id="bankName"
                                            name="bankName"
                                            placeholder="e.g., First Bank"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="accountName">Account Name</Label>
                                        <Input
                                            id="accountName"
                                            name="accountName"
                                            placeholder="e.g., John Doe"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="accountNo">Account Number (10 digits)</Label>
                                        <Input
                                            id="accountNo"
                                            name="accountNo"
                                            placeholder="e.g., 1234567890"
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            required
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? "Submitting..." : "Submit Request"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>

            {/* Withdrawals Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                    <CardDescription>
                        {withdrawals.length} withdrawal{withdrawals.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {withdrawals.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                            No withdrawals yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Bank Details</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.map((withdrawal) => (
                                    <TableRow key={withdrawal.id}>
                                        <TableCell className="font-mono text-xs">
                                            {withdrawal.reference}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{withdrawal.accountName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {withdrawal.bankName} - {withdrawal.accountNo}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(withdrawal.status)}>
                                                {withdrawal.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₦{withdrawal.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {withdrawal.status === "PENDING" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            •••
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(withdrawal.id, "APPROVED")}
                                                        >
                                                            Mark as Approved
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(withdrawal.id, "PAID")}
                                                        >
                                                            Mark as Paid
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleStatusChange(withdrawal.id, "REJECTED")}
                                                        >
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
