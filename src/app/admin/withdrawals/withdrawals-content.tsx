"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WithdrawalForm } from "./withdrawal-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/constants";

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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

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
                <Card className="bg-linear-to-br from-primary to-blue-900 text-white">
                    <CardHeader>
                        <CardDescription className="text-blue-100">Available Balance</CardDescription>
                        <CardTitle className="text-4xl">₦{walletBalance.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-100 text-sm">
                            Minimum withdrawal: ₦{MIN_WITHDRAWAL_AMOUNT}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Withdrawal</CardTitle>
                        <CardDescription>Withdraw funds to your bank account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
                            <SheetTrigger asChild>
                                <Button className="w-full" disabled={walletBalance < MIN_WITHDRAWAL_AMOUNT}>
                                    {walletBalance < MIN_WITHDRAWAL_AMOUNT ? "Insufficient Balance" : "Create Withdrawal"}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:max-w-lg overflow-y-auto px-4 py-6 max-h-[90vh] sm:max-h-full rounded-t-2xl sm:rounded-none">
                                <SheetHeader>
                                    <SheetTitle>Create Withdrawal</SheetTitle>
                                    <SheetDescription>
                                        Enter your bank details and amount
                                    </SheetDescription>
                                </SheetHeader>

                                <WithdrawalForm
                                    walletBalance={walletBalance}
                                    onSuccess={() => setDialogOpen(false)}
                                />
                            </SheetContent>
                        </Sheet>
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
