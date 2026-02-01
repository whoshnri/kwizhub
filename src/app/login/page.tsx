"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { userLogin, adminLogin, logout } from "@/app/actions/auth";
import { getSession, Session } from "@/lib/session";
import { LogOut, Home, LayoutDashboard } from "lucide-react";


export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const searchParams = useSearchParams();
    const isAdmin = searchParams.get("admin") === "true";
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(isAdmin ? "admin" : "user");
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
            title: <>Unlock Your Academic <span className="text-primary italic">Potential.</span></>,
            description: "The ultimate marketplace for high-quality study materials, past questions, and academic resources."
        },
        admin: {
            title: <>Empower the Next <span className="text-primary italic">Generation.</span></>,
            description: "Join our community of expert educators and contributors. Share your knowledge and earn from your materials."
        }
    };

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
        <div className="flex min-h-screen bg-background overflow-hidden font-sans">
            {/* Left Side - Banner Image (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/30 to-transparent z-10" />
                <img
                    src="/images/auth-banner.png"
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

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-card/10 backdrop-blur-sm">
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
                                    Welcome Back, {session.name || session.username}!
                                </h2>
                                <p className="text-muted-foreground font-medium">
                                    You are already signed in to your account.
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
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center space-y-2">
                                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">K</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">KwizHub</span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Welcome Back
                                </h2>
                                <p className="text-muted-foreground font-medium">
                                    Sign in to your account to access your materials
                                </p>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
                                <TabsList className="grid w-full h-full grid-cols-2 p-1.5 bg-muted/50 rounded-xl mb-8">
                                    <TabsTrigger value="user" className="rounded-lg py-1.5 font-bold text-xs uppercase tracking-wide transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                        Student
                                    </TabsTrigger>
                                    <TabsTrigger value="admin" className="rounded-lg py-1.5 font-bold text-xs uppercase tracking-wide transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                        Author
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="user" className="mt-0">
                                    <form onSubmit={handleUserLogin} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="user-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="user-email"
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="user-password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 w-full">
                                                Password
                                            </Label>
                                            <Input
                                                id="user-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full rounded-xl py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={loading}>
                                            {loading ? "Signing in..." : "Sign In"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="admin" className="mt-0">
                                    <form onSubmit={handleAdminLogin} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Author Email
                                            </Label>
                                            <Input
                                                id="admin-email"
                                                name="email"
                                                type="email"
                                                placeholder="author@example.com"
                                                className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 w-full">
                                                Password
                                            </Label>
                                            <Input
                                                id="admin-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full rounded-xl py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={loading}>
                                            {loading ? "Signing in..." : "Sign In as Author"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <div className="text-center space-y-4">
                                <div className="text-sm text-muted-foreground font-medium">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/signup" className="text-primary hover:underline font-bold">
                                        Create one for free
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
