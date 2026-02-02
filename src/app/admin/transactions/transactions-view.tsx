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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, X } from "lucide-react";
import { $Enums } from "@/generated/prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Transaction = {
    id: string;
    type: $Enums.TransactionType;
    amount: number;
    description: string;
    createdAt: Date;
    material: {
        id: string;
        name: string;
        course: string;
        courseCode: string;
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
    currentFilters: { 
        materialId?: string; 
        type?: string;
        startDate?: string;
        endDate?: string;
    };
}) {
    const router = useRouter();
    const [startDate, setStartDate] = useState(currentFilters.startDate || "");
    const [endDate, setEndDate] = useState(currentFilters.endDate || "");

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    function handleFilterChange(key: string, value: string) {
        const params = new URLSearchParams(window.location.search);
        if (value && value !== "all" && value !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    }

    function handleDateRangeChange(start: string, end: string) {
        setStartDate(start);
        setEndDate(end);
        const params = new URLSearchParams(window.location.search);
        if (start) {
            params.set("startDate", start);
        } else {
            params.delete("startDate");
        }
        if (end) {
            params.set("endDate", end);
        } else {
            params.delete("endDate");
        }
        router.push(`?${params.toString()}`);
    }

    function clearDateFilter() {
        handleDateRangeChange("", "");
    }

    function applyQuickDateRange(range: "today" | "week" | "month" | "year" | "all") {
        const today = new Date();
        let start = "";
        let end = "";

        if (range === "today") {
            start = today.toISOString().split("T")[0];
            end = today.toISOString().split("T")[0];
        } else if (range === "week") {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            start = weekAgo.toISOString().split("T")[0];
            end = today.toISOString().split("T")[0];
        } else if (range === "month") {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            start = monthAgo.toISOString().split("T")[0];
            end = today.toISOString().split("T")[0];
        } else if (range === "year") {
            const yearAgo = new Date(today);
            yearAgo.setFullYear(today.getFullYear() - 1);
            start = yearAgo.toISOString().split("T")[0];
            end = today.toISOString().split("T")[0];
        } else {
            // All time - clear dates
            start = "";
            end = "";
        }

        handleDateRangeChange(start, end);
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
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-heading">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Transaction Type */}
                        <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Select
                                value={currentFilters.type || "all"}
                                onValueChange={(val) => handleFilterChange("type", val)}
                                
                            >
                                <SelectTrigger className="w-full p-5">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="SALE">Sale</SelectItem>
                                    <SelectItem value="REFERRAL_COMMISSION">Referral Commission</SelectItem>
                                    <SelectItem value="EQUITY_PAYMENT">Equity Payment</SelectItem>
                                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Material Filter */}
                        <div className="space-y-2">
                            <Label>Material</Label>
                            <Select
                                value={currentFilters.materialId || "all"}
                                onValueChange={(val) => handleFilterChange("materialId", val)}
                            >
                                <SelectTrigger className="w-full p-5">
                                    <SelectValue placeholder="All Materials" />
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

                        {/* Date Range */}
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild className="w-full p-5">
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {startDate && endDate
                                            ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                                            : "Select date range"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4" align="start">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Quick Filters</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => applyQuickDateRange("today")}
                                                >
                                                    Today
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => applyQuickDateRange("week")}
                                                >
                                                    Last 7 Days
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => applyQuickDateRange("month")}
                                                >
                                                    Last Month
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => applyQuickDateRange("year")}
                                                >
                                                    Last Year
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="col-span-2"
                                                    onClick={() => applyQuickDateRange("all")}
                                                >
                                                    All Time
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Custom Range</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => handleDateRangeChange(e.target.value, endDate)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => handleDateRangeChange(startDate, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {(startDate || endDate) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={clearDateFilter}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Clear Dates
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Export Button */}
                        <div className="space-y-2">
                            <Label className="opacity-0">Actions</Label>
                            <Button variant="outline" className="w-full py-6 flex items-center justify-center" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-heading">Transactions</CardTitle>
                            <CardDescription className="mt-1">
                                {transactions.length} record{transactions.length !== 1 ? "s" : ""} found
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-bold text-primary font-heading">₦{totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
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
                                        <TableCell>
                                            <div className="font-medium">
                                                {t.material?.name || "-"}
                                            </div>
                                            {t.material?.courseCode && (
                                                <div className="text-xs text-muted-foreground">
                                                    {t.material.courseCode}
                                                </div>
                                            )}
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
