"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { respondToCoAuthorRequest } from "@/app/actions/materials";
import { useRouter } from "next/navigation";

type Request = {
    id: string;
    name: string;
    equityPercentage: number | null;
    admin: {
        name: string;
        email: string;
    };
};

export function CoAuthorRequests({ requests }: { requests: Request[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    async function handleResponse(id: string, accepted: boolean) {
        setLoading(id);
        const result = await respondToCoAuthorRequest(id, accepted);

        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }
        setLoading(null);
    }

    if (requests.length === 0) return null;

    return (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
                <CardTitle className="text-orange-700 dark:text-orange-400">Pending Co-Author Requests</CardTitle>
                <CardDescription>
                    You have been invited to co-author the following materials.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 bg-white dark:bg-card rounded-lg border shadow-sm">
                            <div>
                                <h4 className="font-semibold">{req.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                    Invited by <span className="font-medium text-foreground">{req.admin.name}</span>
                                </p>
                                <p className="text-sm text-orange-600 font-medium">
                                    Equity Offer: {req.equityPercentage}%
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleResponse(req.id, true)}
                                    disabled={loading === req.id}
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleResponse(req.id, false)}
                                    disabled={loading === req.id}
                                >
                                    Decline
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
