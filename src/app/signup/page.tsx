"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createUser, createAdmin, logout } from "@/app/actions/auth";
import { getSession, Session } from "@/lib/session";
import { LogOut, Home, LayoutDashboard, BookOpen, PenLine } from "lucide-react";

const copy = {
    user: {
        banner: {
            headline: <>Your academic edge <span className="text-primary italic">starts here.</span></>,
            sub: "Join thousands of students accessing curated past questions, lecture notes, and exam prep materials — all verified.",
        },
        heading: "Create a student account",
        sub: "Get instant access to the best academic materials on the platform.",
        cta: "Start Learning Today",
    },
    admin: {
        banner: {
            headline: <>Teach more. <span className="text-primary italic">Earn more.</span></>,
            sub: "Publish your materials, build an audience of eager students, and earn every time someone learns from your work.",
        },
        heading: "Become an author",
        sub: "Share your expertise and earn from every sale. Your knowledge has value.",
        cta: "Register as Author",
    },
} as const;

export default function SignupPage() {
    return (
        <Suspense fallback={<div />}>
            <SignupContent />
        </Suspense>
    );
}

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    // Read initial tab from ?role=author|student
    const roleParam = searchParams.get("role");
    const initialTab: "user" | "admin" = roleParam === "author" ? "admin" : "user";

    const [activeTab, setActiveTab] = useState<"user" | "admin">(initialTab);
    const [session, setSession] = useState<Session | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);

    // Sync tab → URL param
    const handleTabChange = useCallback((tab: "user" | "admin") => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set("role", tab === "admin" ? "author" : "student");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    useEffect(() => {
        async function check() {
            const s = await getSession();
            setSession(s);
            setCheckingSession(false);
        }
        check();
    }, []);

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

    const tab = copy[activeTab];

    return (
        <div className="flex min-h-[111.11vh] bg-background overflow-hidden font-sans">
            {/* Left Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/40 to-transparent z-10" />
                <img
                    src="/images/signup-banner.png"
                    alt="KwizHub"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-primary/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-primary/30">
                            <span className="text-lg font-bold text-primary">K</span>
                        </div>
                        <span className="text-xl font-bold text-white">KwizHub</span>
                    </div>

                    <div className="space-y-4 max-w-lg">
                        <h1 className="text-5xl font-bold leading-tight text-white">
                            {tab.banner.headline}
                        </h1>
                        <p className="text-base text-white/60 leading-relaxed">
                            {tab.banner.sub}
                        </p>
                    </div>

                    <p className="text-xs text-white/30">© {new Date().getFullYear()} KwizHub. All rights reserved.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-white">K</span>
                        </div>
                        <span className="text-lg font-bold">KwizHub</span>
                    </div>

                    {checkingSession ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : session ? (
                        /* Already signed in */
                        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">Welcome, {session.name || session.username}</h2>
                                <p className="text-sm text-muted-foreground">You&apos;re already logged in.</p>
                            </div>
                            <Card className="border-border bg-card">
                                <CardHeader className="pb-2 pt-6 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <span className="text-xl font-bold text-primary">
                                                {(session.name || session.username)[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold">{session.name || session.username}</CardTitle>
                                            <CardDescription className="text-xs">{session.email}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 px-6 pb-6 pt-4">
                                    <Link href={session.type === "admin" ? "/admin" : "/user"}>
                                        <Button className="w-full gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/">
                                        <Button variant="outline" className="w-full gap-2">
                                            <Home className="w-4 h-4" />
                                            Return to Home
                                        </Button>
                                    </Link>
                                    <form action={logout}>
                                        <Button variant="ghost" type="submit" className="w-full gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Signup form */
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">{tab.heading}</h2>
                                <p className="text-sm text-muted-foreground">{tab.sub}</p>
                            </div>

                            <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as "user" | "admin")} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-transparent border border-border rounded-lg mb-4 p-0 h-auto gap-0 overflow-hidden">
                                    <TabsTrigger
                                        value="user"
                                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-none border-r border-border text-muted-foreground transition-all data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none"
                                    >
                                        Student
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="admin"
                                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-none text-muted-foreground transition-all data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none"
                                    >
                                        Author
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="user" className="mt-0">
                                    <form onSubmit={handleUserSignup} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="user-username" className="text-sm font-medium">Username</Label>
                                                <Input
                                                    id="user-username"
                                                    name="username"
                                                    placeholder="johndoe"
                                                    className="bg-muted/30 border-border/50"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="user-email" className="text-sm font-medium">Email</Label>
                                                <Input
                                                    id="user-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="bg-muted/30 border-border/50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="user-password" className="text-sm font-medium">Password</Label>
                                            <Input
                                                id="user-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                minLength={6}
                                                className="bg-muted/30 border-border/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="user-confirm" className="text-sm font-medium">Confirm password</Label>
                                            <Input
                                                id="user-confirm"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-muted/30 border-border/50"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                                            {loading ? "Creating account…" : "Start Learning Today"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* Author signup */}
                                <TabsContent value="admin" className="mt-0">
                                    <form onSubmit={handleAdminSignup} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="admin-name" className="text-sm font-medium">Full name</Label>
                                            <Input
                                                id="admin-name"
                                                name="name"
                                                placeholder="John Doe"
                                                className="bg-muted/30 border-border/50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="admin-username" className="text-sm font-medium">Username</Label>
                                                <Input
                                                    id="admin-username"
                                                    name="username"
                                                    placeholder="johndoe"
                                                    className="bg-muted/30 border-border/50"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="admin-email" className="text-sm font-medium">Email</Label>
                                                <Input
                                                    id="admin-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="author@example.com"
                                                    className="bg-muted/30 border-border/50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                                                <Input
                                                    id="admin-password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    minLength={6}
                                                    className="bg-muted/30 border-border/50"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="admin-confirm" className="text-sm font-medium">Confirm</Label>
                                                <Input
                                                    id="admin-confirm"
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="bg-muted/30 border-border/50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                                            {loading ? "Creating account…" : "Register as Author"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border/20 w-fit mx-auto">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground/60 hover:text-foreground">
                                Back to homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
