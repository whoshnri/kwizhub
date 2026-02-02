"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Download, Smartphone } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-heading",
});

export default function AppDownloadThanks() {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [count]);

    return (
        <div className={`min-h-[111.11vh] flex flex-col items-center justify-center bg-background p-4 text-center font-sans relative overflow-hidden ${ibm_plex_sans.variable}`}>
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-lg w-full space-y-8">
                {/* Success Icon */}
                <div className="flex justify-center mb-6 animate-in zoom-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative w-24 h-24 bg-linear-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 transition-transform hover:rotate-0">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-background border-4 border-background rounded-full p-2 text-primary shadow-lg">
                            <Download className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight leading-tight">
                        Download <span className="text-primary italic">Started!</span>
                    </h1>
                    <p className="text-lg text-muted-foreground/80 font-medium">
                        Get ready to experience KwizHub on your mobile device.
                    </p>
                </div>

                <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Starting in</span>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl">
                            {count > 0 ? count : "0"}
                        </div>
                        <span>Seconds</span>
                    </div>

                    <div className="w-full h-1 bg-border/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-linear"
                            style={{ width: `${((3 - count) / 3) * 100}%` }}
                        />
                    </div>

                    <p className="text-sm text-zinc-500">
                        If the download doesn't start automatically,{" "}
                        <button className="text-primary hover:text-primary/80 hover:underline font-bold transition-all cursor-pointer">
                            click here to download manually
                        </button>
                    </p>
                </div>

                <div className="pt-8 animate-in fade-in duration-1000 delay-500">
                    <Link href="/user/materials" className="inline-block">
                        <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-xs font-bold uppercase tracking-widest border-2 hover:bg-primary/5 hover:text-primary transition-all gap-2 group">
                            <Smartphone className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Return to App Page
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
