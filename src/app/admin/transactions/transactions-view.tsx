"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { $Enums } from "@/generated/prisma/client";

type Transaction = {
    id: string;
    type: $Enums.TransactionType;
    amount: number;
    description: string;
    createdAt: Date;
    material: {
        name: string;
        course: string;
    } | null;
    order: {
        paymentRef: string;
        user: {
            username: string;
            email: string;
        };
    } | null;
};

type Material = {
    id: string;
    name: string;
};

export function TransactionsView({
    transactions,
    materials,
    currentFilters
}: {
    transactions: Transaction[];
    materials: Material[];
    currentFilters: { materialId?: string; type?: string };
}) {
    const router = useRouter();

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    function handleFilterChange(key: string, value: string) {
        const params = new URLSearchParams(window.location.search);
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    }

    function handleExport() {
        // Convert transactions to CSV
        const headers = ["Date", "Type", "Material", "Amount", "Description", "Buyer", "Reference"];
        const rows = transactions.map(t => [
            new Date(t.createdAt).toLocaleDateString(),
            t.type,
            t.material?.name || "N/A",
            t.amount.toString(),
            `"${t.description}"`, // Quote description to handle commas
            t.order?.user.username || "N/A",
            t.order?.paymentRef || "N/A"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex gap-4 w-full md:w-auto">
                    <Select
                        value={currentFilters.type || "all"}
                        onValueChange={(val) => handleFilterChange("type", val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="SALE">Sale</SelectItem>
                            <SelectItem value="REFERRAL_COMMISSION">Referral Commission</SelectItem>
                            <SelectItem value="EQUITY_PAYMENT">Equity Payment</SelectItem>
                            {/* WITHDRAWAL likely not linked to material, need careful handling if filter by material + Withdrawal */}
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentFilters.materialId || "all"}
                        onValueChange={(val) => handleFilterChange("materialId", val)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by Material" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Materials</SelectItem>
                            {materials.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Filtered Transactions</CardTitle>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                    <CardDescription>
                        {transactions.length} record{transactions.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                            No transactions found matching criteria.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <Badge variant="secondary">{t.type.replace("_", " ")}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {t.material?.name || "-"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {t.description}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₦{t.amount.toLocaleString()}
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
