"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { userLogin, adminLogin, logout } from "@/app/actions/auth";
import { getSession, Session } from "@/lib/session";
import { LogOut, Home, LayoutDashboard, BookOpen, PenLine } from "lucide-react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div />}>
            <LoginContent />
        </Suspense>
    );
}

const copy = {
    user: {
        banner: {
            headline: <>Your materials are <span className="text-primary italic">waiting.</span></>,
            sub: "Sign in and pick up right where you left off. Your library, purchases, and progress are all here.",
        },
        heading: "Welcome back",
        sub: "Sign in to your student account to access your materials.",
        cta: "Sign In",
    },
    admin: {
        banner: {
            headline: <>Your students are <span className="text-primary italic">waiting.</span></>,
            sub: "Sign in to manage your published materials, track earnings, and reach more learners.",
        },
        heading: "Author sign in",
        sub: "Access your author dashboard to manage your content and payouts.",
        cta: "Sign In as Author",
    },
} as const;

function LoginContent() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Read initial tab from ?role=author|student OR legacy ?admin=true
    const roleParam = searchParams.get("role");
    const legacyAdmin = searchParams.get("admin") === "true";
    const initialTab: "user" | "admin" =
        roleParam === "author" ? "admin" : roleParam === "student" ? "user" : legacyAdmin ? "admin" : "user";

    const [activeTab, setActiveTab] = useState<"user" | "admin">(initialTab);
    const [session, setSession] = useState<Session | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);

    // Sync tab → URL param
    const handleTabChange = useCallback((tab: "user" | "admin") => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set("role", tab === "admin" ? "author" : "student");
        params.delete("admin"); // drop legacy param
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

    const tab = copy[activeTab];

    return (
        <div className="flex min-h-[111.11vh] bg-background overflow-hidden font-sans">
            {/* Left Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/40 to-transparent z-10" />
                <img
                    src="/images/auth-banner.png"
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
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-white">K</span>
                        </div>
                        <span className="text-lg font-bold">KwizHub</span>
                    </div>

                    {checkingSession ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : session ? (
                        /* Already signed in */
                        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">Welcome back, {session.name || session.username}</h2>
                                <p className="text-sm text-muted-foreground">You&apos;re already signed in.</p>
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
                        /* Login form */
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
                                    <form onSubmit={handleUserLogin} className="space-y-4">
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
                                        <div className="space-y-1.5">
                                            <Label htmlFor="user-password" className="text-sm font-medium">Password</Label>
                                            <Input
                                                id="user-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-muted/30 border-border/50"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                                            {loading ? "Signing in…" : "Sign In"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="admin" className="mt-0">
                                    <form onSubmit={handleAdminLogin} className="space-y-4">
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
                                        <div className="space-y-1.5">
                                            <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                                            <Input
                                                id="admin-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-muted/30 border-border/50"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                                            {loading ? "Signing in…" : "Sign In as Author"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <p className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-primary font-semibold hover:underline">
                                    Create one free
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
