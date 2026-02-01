"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, Session } from "@/lib/session";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    useEffect(() => {
        async function get() {
            const session = await getSession();
            setSession(session);
        }
        get();
    }, []);

    return (
        <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 transition-all duration-500 ease-in-out pointer-events-none ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
                }`}
        >
            <nav className="pointer-events-auto h-16 border border-border/40 bg-background/60 backdrop-blur-xl rounded-full px-6 flex items-center justify-between shadow-lg shadow-black/20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300 ">
                            <span className="text-white font-bold text-base">K</span>
                        </div>
                    </div>
                    <span className="text-lg font-bold font-heading text-foreground hidden sm:block">KwizHub</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/marketplace"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Marketplace
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {session ? (
                        <Link href={session.type === "admin" ? "/admin" : "/user"}>
                            <Button size="sm" className="rounded-full px-5">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" size="sm" className="text-sm font-medium">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="rounded-full px-5 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 bg-black text-white hover:bg-black/90">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Trigger */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] border-l border-white/5 bg-black/95 backdrop-blur-2xl p-0">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">Access KwizHub navigation and account options</SheetDescription>
                            <div className="flex flex-col h-full">
                                {/* Brand Header */}
                                <div className="p-8 pb-6 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                            <span className="text-white font-bold text-xl">K</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl font-bold font-heading text-white">KwizHub</span>
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Academic Hub</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 px-4 py-8 space-y-2">
                                    <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Navigations</p>
                                    <Link
                                        href="/marketplace"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary/20 transition-all">
                                            <ShoppingBag className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-white">Marketplace</span>
                                            <span className="text-xs text-zinc-500">Browse materials</span>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary/20 transition-all">
                                            <MessageSquare className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-white">Contact Us</span>
                                            <span className="text-xs text-zinc-500">Get support</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-8 border-t border-white/5 bg-zinc-950/50">
                                    <div className="flex flex-col gap-3">
                                        {!session ? (
                                            <>
                                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                    <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5">
                                                        Sign In
                                                    </Button>
                                                </Link>
                                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                                    <Button className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest">
                                                        Get Started
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href={session.type === "admin" ? "/admin" : "/user"}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Button className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                                    Open Dashboard
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </div>
    );
}
