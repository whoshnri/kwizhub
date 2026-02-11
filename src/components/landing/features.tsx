import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Shield, Lock, Smartphone, ArrowLeftRight } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function Features() {
    return (
        <section className="py-24 bg-background px-10">
            <div className="max-w-7xl mx-auto space-y-20">
                {/* Section Header */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
                        Empowering Students <br className="hidden lg:block" />
                        With Premium Academic <br className="hidden lg:block" />
                        Resources
                    </h2>
                    <div className="space-y-6 md:pt-4">
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                            Access a vast library of verified study materials, past questions, and academic resources.
                            We're dedicated to simplifying your learning journey with high-quality content delivered instantly to your device.
                        </p>
                        <Link href="/marketplace">
                            <Button className="rounded-full px-8 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                                Explore More
                                <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
                    {/* Item 1 */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                            <div className="absolute w-32 h-32 rounded-full bg-primary/5 border border-primary/10 animate-pulse" />
                            <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <CheckCircle className="w-12 h-12 text-primary" />
                                <div className="absolute -top-2 -right-2 bg-primary text-[10px] text-white font-bold px-2 py-0.5 rounded-full shadow-lg">VERIFIED</div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Verified & Quality Study Materials</h3>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <div className="w-48 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
                                <div className="absolute right-12 w-2 h-2 rounded-full bg-primary animate-ping" />
                            </div>
                            <div className="relative w-20 h-24 rounded-xl bg-linear-to-b from-primary/10 to-transparent border border-primary/20 flex flex-col items-center justify-center gap-2 -translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                                <div className="w-12 h-1 bg-primary/40 rounded-full" />
                                <div className="w-8 h-1 bg-primary/20 rounded-full self-start ml-4" />
                                <Zap className="w-8 h-8 text-primary mt-2 animate-bounce" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Instant Digital Material Delivery</h3>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                            <div className="absolute w-28 h-28 rounded-full border border-primary/10 scale-125 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative w-20 h-24 flex items-center justify-center bg-linear-to-b from-primary/20 to-primary/5 rounded-xl border border-primary/30">
                                <Shield className="w-14 h-14 text-primary relative z-10" />
                                <Lock className="absolute w-5 h-5 text-white z-20 translate-y-1" />
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/20 rounded-full border-dashed animate-spin-slow" />
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Secure & Encrypted Transactions</h3>
                    </div>

                    {/* Item 4 */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative px-8">
                            <div className="absolute w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                            <div className="flex items-center justify-between w-full max-w-[200px] relative z-10">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-primary/60" />
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-1 group-hover:px-4 transition-all duration-500">
                                    <ArrowLeftRight className="w-6 h-6 text-primary animate-pulse" />
                                    <div className="w-full h-0.5 bg-primary/20 rounded-full" />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-primary border border-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="text-white font-bold text-xs uppercase">App</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Seamless Mobile Learning Experience</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
