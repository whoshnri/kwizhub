"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteUserAccount } from "@/app/actions/auth";

export default function UserSettingsPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    async function handleDeleteAccount() {
        if (!password) {
            toast.error("Please enter your password");
            return;
        }

        setDeleting(true);

        const result = await deleteUserAccount({ password });

        if (result.success) {
            toast.success(result.message);
            router.push("/");
        } else {
            toast.error(result.message);
        }

        setDeleting(false);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div>
                            <h3 className="font-semibold">Delete Account</h3>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data
                            </p>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. Your account will be permanently
                                        deleted and you will lose access to all purchased materials.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">
                                            Enter your password to confirm
                                        </Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDialogOpen(false);
                                            setPassword("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={deleting || !password}
                                    >
                                        {deleting ? "Deleting..." : "Delete Account"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
