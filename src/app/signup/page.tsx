"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createUser, createAdmin } from "@/app/actions/auth";
import Navbar from "@/components/layout/navbar";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleUserSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        const result = await createUser({
            email: formData.get("email") as string,
            username: formData.get("username") as string,
            password,
        });

        if (result.success) {
            toast.success(result.message);
            router.push("/user");
            router.refresh();
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    }

    async function handleAdminSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        const result = await createAdmin({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            username: formData.get("username") as string,
            password,
        });

        if (result.success) {
            toast.success(result.message);
            router.push("/admin");
            router.refresh();
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />

            <div className="flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>
                            Join KwizHub to access quality study materials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="user" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="user">Student</TabsTrigger>
                                <TabsTrigger value="admin">Author</TabsTrigger>
                            </TabsList>

                            <TabsContent value="user">
                                <form onSubmit={handleUserSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="user-username">Username</Label>
                                        <Input
                                            id="user-username"
                                            name="username"
                                            type="text"
                                            placeholder="johndoe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="user-email">Email</Label>
                                        <Input
                                            id="user-email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="user-password">Password</Label>
                                        <Input
                                            id="user-password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="user-confirm">Confirm Password</Label>
                                        <Input
                                            id="user-confirm"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="admin">
                                <form onSubmit={handleAdminSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-name">Full Name</Label>
                                        <Input
                                            id="admin-name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-username">Username</Label>
                                        <Input
                                            id="admin-username"
                                            name="username"
                                            type="text"
                                            placeholder="johndoe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-email">Email</Label>
                                        <Input
                                            id="admin-email"
                                            name="email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-password">Password</Label>
                                        <Input
                                            id="admin-password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-confirm">Confirm Password</Label>
                                        <Input
                                            id="admin-confirm"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Creating account..." : "Create Author Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
