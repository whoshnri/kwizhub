"use client";

import { WaitlistForm } from "@/components/landing/waitlist-form";
import { IBM_Plex_Sans } from "next/font/google";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Features } from "@/components/landing/features";
import { Highlight } from "@/components/ui/hero-highlight";
import { IconBookUpload, IconCurrencyNaira, IconMoneybagPlus, IconBrandX, IconShieldCheck } from "@tabler/icons-react"
import { useEffect, useState } from "react";


const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function PrelaunchPage() {
    const [waitlistCount, setWaitlistCount] = useState<number | string>(10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_WAITLIST_URL;
                if (!url || url === "APPSCRIPT_WEB_APP_URL") {
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(url);
                const data = await response.json();
                if (data.status === "success" && data.value) {
                    setWaitlistCount(data.value);
                }
            } catch (error) {
                console.error("Failed to fetch waitlist count:", error);
                setWaitlistCount(10); // Default fallback
            } finally {
                setIsLoading(false);
            }
        };

        fetchCount();
        // Refresh every 5 minutes
        const interval = setInterval(fetchCount, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col items-center overflow-x-hidden">
            {/* Absolute Background Elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] px-2 shadow-inner" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[150px] rounded-full opacity-50" />
            </div>

            <main className="relative z-10 w-full">
                {/* Prelaunch Bento Grid Hero */}
                <section className="min-h-screen flex flex-col items-center justify-center px-4 lg:px-8 py-24">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

                        {/* Left Column: Vision & Waitlist (Large Card) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="lg:col-span-7 bg-zinc-950/50 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 lg:p-16 flex flex-col gap-12 relative overflow-hidden group min-h-[600px]"
                        >
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/10">
                                    <span className="text-black font-extrabold text-2xl">K</span>
                                </div>
                                <span className={`text-2xl font-bold tracking-tight text-blue-600 ${ibm_plex_sans.className}`}>KwizHub</span>
                            </div>

                            <div className="space-y-8 relative z-10 flex-grow flex flex-col justify-center">
                                <h1 className={`text-5xl grid md:text-7xl xl:text-7xl font-black font-heading tracking-tight leading-[0.85] ${ibm_plex_sans.className}`}>
                                    Publish, Sell <br />
                                    and <Highlight className="bg-blue-950 w-fit">Scale With Ease.</Highlight>
                                </h1>
                                <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed">
                                    The marketplace for verified academic creators.
                                    Join the circle of top educators.
                                </p>

                                <div className="pt-3">
                                    <WaitlistForm />
                                </div>
                            </div>

                            {/* Social Proof Indicator */}
                            <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {["J", "K", "H", "O"].map(i => (
                                        <div key={i} className={`p-3 w-fit rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center text-xs font-bold ${i === "O" ? 'bg-primary text-white' : 'text-zinc-500'}`}>
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    {isLoading ? (
                                        <div className="h-5 w-24 bg-white/5 animate-pulse rounded-md border border-white/5" />
                                    ) : (
                                        <span className="text-white font-bold text-sm tracking-tight">{waitlistCount}+ Early Members</span>
                                    )}
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase leading-none mt-1">Joined Already</span>
                                </div>
                            </div>

                            {/* Animated Glow */}
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-1000" />
                        </motion.div>

                        {/* Right Column: Author Benefits (4 Dynamic Cards) */}
                        <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 h-full">

                            {/* Benefit 1: Publish */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-between group hover:bg-zinc-900/50 transition-all duration-300"
                            >
                                <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform">
                                    <IconBookUpload className="w-10 h-10 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Post Materials</h3>
                                    <p className="text-zinc-400 text-xs sm:text-lg  leading-relaxed">
                                        Upload verified study guides, past questions, and academic resources effortlessly.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Benefit 2: Get Paid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-between group hover:bg-zinc-900/50 transition-all duration-300"
                            >
                                <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform">
                                    <IconMoneybagPlus className="w-10 h-10 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Direct Purchases</h3>
                                    <p className="text-zinc-400 text-xs sm:text-lg  leading-relaxed">
                                        Get paid instantly for every material purchase. Full transparency on sales and earnings.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Benefit 3: Secure App */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-between group hover:bg-zinc-900/50 transition-all duration-300"
                            >
                                <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform">
                                    <IconShieldCheck className="w-10 h-10 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Secure Reading App</h3>
                                    <p className="text-zinc-400 text-xs sm:text-lg  leading-relaxed">
                                        Materials are protected within our secure reading offline application, preventing unauthorized distribution.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Benefit 4: Refer & Withdraw */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-between group hover:bg-zinc-900/50 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform">
                                    <IconCurrencyNaira className="w-10 h-10 text-primary" />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Withdraw Anytime</h3>
                                    <p className="text-zinc-400 text-xs sm:text-lg  leading-relaxed">
                                        Withdraw your accumulated earnings securely into your local bank account instantly.
                                    </p>
                                </div>
                                {/* Visual Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            </motion.div>

                        </div>

                    </div>
                </section>

                {/* Platform Features Section */}
                <section className="border-t border-white/5 bg-zinc-950/50">
                    <Features hideCTA={true} />
                </section>

                {/* Closing */}
                <footer className="py-10 text-center px-6 border-t border-white/5 bg-zinc-950">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-center gap-6">
                            <a
                                href="https://x.com/xyz_07hb"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 group"
                            >
                                <IconBrandX className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                        <p className="text-sm font-medium text-white/30">&copy; {new Date().getFullYear()} KwizHub.</p>
                    </motion.div>
                </footer>
            </main>
        </div>
    );
}
