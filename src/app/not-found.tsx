import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ShoppingBag, LayoutDashboard, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 selection:bg-primary/10">
            {/* Home Page Background Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-10 animate-in fade-in duration-1000">
                {/* Minimal Header */}
                <div className="space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                        Error 404
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Page not <span className="text-primary/80 italic">found</span>
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                        The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Structured Links Grid */}
                <div className="w-full grid gap-3 sm:grid-cols-2 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <Link href="/" className="group">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Home className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold">Homepage</span>
                                <span className="text-[10px] text-muted-foreground">Start from the beginning</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/marketplace" className="group">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold">Marketplace</span>
                                <span className="text-[10px] text-muted-foreground">Find study materials</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/user" className="group">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold">Dashboard</span>
                                <span className="text-[10px] text-muted-foreground">Manage your account</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/contact" className="group">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold">Support</span>
                                <span className="text-[10px] text-muted-foreground">Get help from our team</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Secondary Back Link */}
                <div className="flex items-center gap-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground animate-in fade-in duration-1000 delay-500">
                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </Link>

                </div>
            </div>
        </div>
    );
}
