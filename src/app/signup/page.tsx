"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createUser, createAdmin, logout } from "@/app/actions/auth";
import { getSession, Session } from "@/lib/session";
import { LogOut, Home, LayoutDashboard } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("user");
    const [session, setSession] = useState<Session | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        async function check() {
            const s = await getSession();
            setSession(s);
            setCheckingSession(false);
        }
        check();
    }, []);

    const bannerContent = {
        user: {
            title: <>Join the Future of <span className="text-primary italic">Learning.</span></>,
            description: "Create an account to start exploring, purchasing, or selling high-quality academic materials."
        },
        admin: {
            title: <>Ready to <span className="text-primary italic">Influence?</span></>,
            description: "Become a contributor today. Upload your materials, reach thousands of students, and build your profile."
        }
    };

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
        <div className="flex min-h-screen bg-background overflow-hidden font-sans">
            {/* Left Side - Banner Image (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/30 to-transparent z-10" />
                <img
                    src="/images/signup-banner.png"
                    alt="KwizHub"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-primary/30">
                            <span className="text-xl font-bold text-primary">K</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">KwizHub</span>
                    </div>

                    <div className="space-y-4 max-w-lg">
                        <h1 className="text-5xl font-bold leading-tight text-white tracking-tight">
                            {bannerContent[activeTab as keyof typeof bannerContent].title}
                        </h1>
                        <p className="text-lg text-white/70 font-medium">
                            {bannerContent[activeTab as keyof typeof bannerContent].description}
                        </p>
                    </div>

                    <div className="text-sm text-white/40 font-medium">
                        © 2026 KwizHub. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-card/10 backdrop-blur-sm overflow-y-auto">
                <div className="w-full max-w-md">
                    {session ? (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="text-center space-y-2">
                                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">K</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">KwizHub</span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Welcome, {session.name || session.username}!
                                </h2>
                                <p className="text-muted-foreground font-medium">
                                    Ready to continue your journey? You&apos;re already logged in.
                                </p>
                            </div>

                            <Card className="border-primary/20 bg-background/50 backdrop-blur-sm overflow-hidden shadow-xl">
                                <CardHeader className="text-center pb-2">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/30 rotate-3 shadow-inner">
                                            <span className="text-3xl font-bold text-primary">
                                                {session.name ? session.name[0].toUpperCase() : session.username[0].toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold uppercase tracking-tight">{session.type === 'admin' ? 'Author Account' : 'Student Account'}</CardTitle>
                                    <CardDescription>
                                        {session.email}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="grid gap-3">
                                        <Link href={session.type === "admin" ? "/admin" : "/user"}>
                                            <Button className="w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                        <Link href="/">
                                            <Button variant="outline" className="w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest gap-3 hover:bg-muted active:scale-[0.98] transition-all">
                                                <Home className="w-4 h-4" />
                                                Return to Home
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="pt-4 border-t border-border/40">
                                        <form action={logout}>
                                            <Button variant="ghost" type="submit" className="w-full py-6 rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
                                                <LogOut className="w-3.5 h-3.5" />
                                                Sign out of this account
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : checkingSession ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Checking access...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 my-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center space-y-2">
                                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">K</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">KwizHub</span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Create Account
                                </h2>
                                <p className="text-muted-foreground font-medium">
                                    Join thousands of students and authors on KwizHub
                                </p>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full h-full grid-cols-2 p-1.5 bg-muted/50 rounded-xl mb-6">
                                    <TabsTrigger value="user" className="rounded-lg py-1.5 font-bold text-xs uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                        Student
                                    </TabsTrigger>
                                    <TabsTrigger value="admin" className="rounded-lg py-1.5 font-bold text-xs uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                        Author
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="user" className="mt-0 space-y-4">
                                    <form onSubmit={handleUserSignup} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="user-username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    Username
                                                </Label>
                                                <Input
                                                    id="user-username"
                                                    name="username"
                                                    type="text"
                                                    placeholder="johndoe"
                                                    className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="user-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="user-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="user-password" title="At least 6 characters" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Password
                                            </Label>
                                            <Input
                                                id="user-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                minLength={6}
                                                className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="user-confirm" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="user-confirm"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full rounded-xl py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={loading}>
                                            {loading ? "Creating account..." : "Start Learning Today"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="admin" className="mt-0 space-y-4">
                                    <form onSubmit={handleAdminSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="admin-name"
                                                name="name"
                                                type="text"
                                                placeholder="John Doe"
                                                className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="admin-username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    Username
                                                </Label>
                                                <Input
                                                    id="admin-username"
                                                    name="username"
                                                    type="text"
                                                    placeholder="johndoe"
                                                    className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="admin-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="admin@example.com"
                                                    className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="admin-password" title="At least 6 characters" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    Password
                                                </Label>
                                                <Input
                                                    id="admin-password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    minLength={6}
                                                    className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="admin-confirm" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    Confirm
                                                </Label>
                                                <Input
                                                    id="admin-confirm"
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="py-5 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" size="lg" className="w-full rounded-xl py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={loading}>
                                            {loading ? "Creating account..." : "Register as Author"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <div className="text-center space-y-4">
                                <div className="text-sm text-muted-foreground font-medium">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-primary hover:underline font-bold">
                                        Sign in instead
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border/20 w-fit mx-auto">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground">
                                ← Back to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
