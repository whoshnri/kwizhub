"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, Session } from "@/lib/session";
import { useEffect, useState } from "react";
import { Menu, X, BookOpen, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        async function get() {
            const session = await getSession();
            setSession(session);
        }
        get();
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300 ">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-heading text-foreground leading-none">KwizHub</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/marketplace"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                        >
                            Marketplace
                        </Link>
                        <Link
                            href="/app"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                        >
                            Mobile App
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <Link href={session.type === "admin" ? "/admin" : "/user"}>
                                <Button size="sm" className="shadow-sm">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm" className="shadow-sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="flex items-center gap-2.5 pb-4 border-b">
                                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">K</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold font-heading">KwizHub</span>
                                        <span className="text-[10px] text-muted-foreground">Academic Excellence</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Link
                                        href="/marketplace"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        Marketplace
                                    </Link>
                                    <Link
                                        href="/app"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <BookOpen className="h-5 w-5" />
                                        Mobile App
                                    </Link>
                                </div>

                                <div className="pt-4 border-t flex flex-col gap-3">
                                    {session ? (
                                        <Link 
                                            href={session.type === "admin" ? "/admin" : "/user"}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Button className="w-full" size="sm">
                                                Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full" size="sm">
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full" size="sm">
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
