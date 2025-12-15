"use strict";
"use client";

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
import { toast } from "sonner";
import { deleteReferralCode } from "@/app/actions/referrals";
import { useRouter } from "next/navigation";

// Define a local type for the referral code structure returned by getMyReferralCodes
type ReferralCode = {
    id: string;
    code: string;
    earningsPercentage: number;
    usageCount: number;
    createdAt: Date;
    materialId: string;
    material: {
        name: string;
    };
};

export function ReferralManager({ codes }: { codes: ReferralCode[] }) {
    const router = useRouter();

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        const result = await deleteReferralCode(id);
        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Your Codes</CardTitle>
                    <CardDescription>Share these codes to earn commissions.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Uses</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {codes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No referral codes generated yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            codes.map((code) => (
                                <TableRow key={code.id}>
                                    <TableCell className="font-mono font-medium">{code.code}</TableCell>
                                    <TableCell>{code.material.name}</TableCell>
                                    <TableCell>{code.earningsPercentage}%</TableCell>
                                    <TableCell>{code.usageCount}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(code.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
