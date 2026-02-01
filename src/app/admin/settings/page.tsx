"use client";

import { useState, useEffect } from "react";
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
import { deleteAdminAccount, updateAdminCredentials } from "@/app/actions/auth";
import { getSession } from "@/lib/session";

export default function AdminSettingsPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const session = await getSession();
            if (session && session.type === "admin") {
                setName(session.name || "");
                setUsername(session.username || "");
                setEmail(session.email || "");
            }
            setLoading(false);
        }
        load();
    }, []);

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        setUpdating(true);

        const result = await updateAdminCredentials({
            name: name || undefined,
            username: username
        });

        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }

        setUpdating(false);
    }

    async function handleDeleteAccount() {
        if (!password) {
            toast.error("Please enter your password");
            return;
        }

        setDeleting(true);

        const result = await deleteAdminAccount({ password });

        if (result.success) {
            toast.success(result.message);
            router.push("/");
        } else {
            toast.error(result.message);
        }

        setDeleting(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your administrator profile
                </p>
            </div>

            <Card className="">
                <CardHeader>
                    <CardTitle>Profile Credentials</CardTitle>
                    <CardDescription>
                        Update your public information as an Author
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                Email Address
                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-normal">Primary</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                className="bg-muted/50 cursor-not-allowed"
                            />
                            <p className="text-[11px] text-muted-foreground pl-1">
                                Email cannot be changed for security purposes.
                            </p>
                        </div>
                        <div className="flex justify-start pt-2">
                            <Button type="submit" disabled={updating}>
                                {updating ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="">
                <CardHeader>
                    <CardTitle className="text-destructive font-heading">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-destructive/20 rounded-xl bg-destructive/5 gap-4">
                        <div className="space-y-1">
                            <h3 className="font-bold text-destructive">Delete Author Account</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                Permanently delete your profile and remove all your materials from the platform. This action is irreversible.
                            </p>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="w-full sm:w-auto font-bold uppercase tracking-wider text-xs">
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Are you absolutely sure?</DialogTitle>
                                    <DialogDescription className="pt-2">
                                        This will permanently delete your author account and remove all your published materials. You will lose access to your wallet and transaction history.
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
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="gap-2 sm:gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDialogOpen(false);
                                            setPassword("");
                                        }}
                                        className="rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={deleting || !password}
                                        className="rounded-xl font-bold"
                                    >
                                        {deleting ? "Deleting..." : "Confirm Deletion"}
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
