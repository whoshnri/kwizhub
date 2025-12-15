"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, Session } from "@/lib/session";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        async function get() {
            const session = await getSession();
            setSession(session);
        }
        get();
    }, []);


    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="text-xl font-bold text-primary">KwizHub</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/marketplace"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Marketplace
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {session ? (
                            <Link href={session.type === "admin" ? "/admin" : "/user"}>
                                <Button>Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
