"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, Session } from "@/lib/session";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, MessageSquare, User, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

export default function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => { setMounted(true); }, []);

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
            <nav className="pointer-events-auto h-16 border border-border/40 bg-background/60 backdrop-blur-xl rounded-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="relative">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center transition-all duration-300">
                            <span className="text-white font-bold text-base">K</span>
                        </div>
                    </div>
                    <span className="text-lg font-bold font-heading text-foreground hidden sm:block">KwizHub</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/marketplace"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Marketplace
                    </Link>
                    <Link
                        href="/authors"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Authors
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Contact
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Dark Mode Toggle */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full cursor-pointer"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>
                    )}

                    {session ? (
                        <Link href={session.type === "admin" ? "/admin" : "/user"}>
                            <Button size="sm" className="rounded-lg px-5 cursor-pointer">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" size="sm" className="text-sm font-medium cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="rounded-lg px-5 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 bg-black text-white hover:bg-black/90 cursor-pointer">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Trigger */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-sm border-l border-border bg-background/95 backdrop-blur-2xl p-0">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">Access KwizHub navigation and account options</SheetDescription>
                            <div className="flex flex-col h-full">
                                {/* Brand Header */}
                                <div className="p-8 pb-6 border-b border-border bg-linear-to-b from-muted/50 to-transparent">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                                            <span className="text-primary-foreground font-bold text-xl">K</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl font-bold font-heading text-foreground">KwizHub</span>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">Academic Hub</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 px-4 py-8 space-y-2">
                                    <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase mb-4">Navigations</p>
                                    <Link
                                        href="/marketplace"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary/20 transition-all">
                                            <ShoppingBag className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-foreground">Marketplace</span>
                                            <span className="text-xs text-muted-foreground">Browse materials</span>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/authors"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary/20 transition-all">
                                            <User className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-foreground">Authors</span>
                                            <span className="text-xs text-muted-foreground">Meet our contributors</span>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary/20 transition-all">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-foreground">Contact Us</span>
                                            <span className="text-xs text-muted-foreground">Get support</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-8 border-t border-border bg-muted/30">
                                    <div className="flex flex-col gap-3">
                                        {!session ? (
                                            <>
                                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                    <Button variant="outline" className="w-full h-12 rounded-lg text-xs font-bold uppercase hover:bg-muted cursor-pointer">
                                                        Sign In
                                                    </Button>
                                                </Link>
                                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                                    <Button className="w-full h-12 rounded-lg text-xs font-bold uppercase cursor-pointer">
                                                        Get Started
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href={session.type === "admin" ? "/admin" : "/user"}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Button className="w-full h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase cursor-pointer">
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
