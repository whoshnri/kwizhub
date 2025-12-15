"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { userLogin, adminLogin } from "@/app/actions/auth";
import Navbar from "@/components/layout/navbar";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isAdmin = searchParams.get("admin") === "true";
    const [loading, setLoading] = useState(false);

    async function handleUserLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await userLogin({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
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

    async function handleAdminLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await adminLogin({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
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
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={isAdmin ? "admin" : "user"} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="user">Student</TabsTrigger>
                                <TabsTrigger value="admin">Author</TabsTrigger>
                            </TabsList>

                            <TabsContent value="user">
                                <form onSubmit={handleUserLogin} className="space-y-4">
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
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="admin">
                                <form onSubmit={handleAdminLogin} className="space-y-4">
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
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Signing in..." : "Sign In as Author"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
