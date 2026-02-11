import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function Hero() {
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center pt-32 pb-16 md:pt-48 md:pb-32 px-7">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-5xl mx-auto space-y-14">
                    {/* Mentor Badge */}
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-3 bg-muted/50 border border-border/50 rounded-full px-5 py-2 backdrop-blur-md shadow-sm transition-transform hover:scale-105 cursor-default">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary/20 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-accent/20 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Max" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <span className="text-sm font-medium text-foreground/80">100+ Quality Materials Available</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight leading-[1.05] ${ibm_plex_sans.className}`}>
                            Elevating Education
                            <span className="block text-foreground/90 mt-2">
                                with <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent relative">
                                    KwizHub
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                    </svg>
                                </span>
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                            Unlock your potential with premium study materials, past questions, and academic resources.
                            The smarter way to excel in your academic journey.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Link href="/marketplace" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all cursor-pointer">
                                Start Learning Now
                                <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
