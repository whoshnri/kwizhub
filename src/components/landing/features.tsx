import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Coins, FileBadge, BarChart3, ArrowRight } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";
import { IconNetwork } from "@tabler/icons-react";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function Features({ hideCTA = false }: { hideCTA?: boolean }) {
    return (
        <section className="py-24 bg-transparent px-10">
            <div className="max-w-7xl mx-auto space-y-20">
                {/* Section Header */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
                        Empowering Educators <br className="hidden lg:block" />
                        And Academic <br className="hidden lg:block" />
                        Creators
                    </h2>
                    <div className="space-y-6 md:pt-4">
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                            The ultimate platform to publish, share, and monetize your academic expertise.
                            We provide the tools you need to reach a global audience and earn significantly from your knowledge.
                        </p>
                        {!hideCTA && (
                            <Link href="/signup?role=author">
                                <Button className="rounded-full px-8 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                                    Become an Author
                                    <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 max-sm:scale-90 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
                    {/* Item 1: Global Distribution */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                            <div className="absolute w-32 h-32 rounded-full border border-primary/5 animate-[ping_3s_linear_infinite] opacity-20" />
                            <div className="absolute w-24 h-24 rounded-full bg-primary/5 border border-primary/10 animate-pulse" />
                            <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <IconNetwork className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Large Content Distribution</h3>
                    </div>

                    {/* Item 2: Royalties */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border border-primary/10 scale-110 group-hover:scale-125 transition-transform" />
                            </div>
                            <div className="relative w-24 h-24 rounded-full bg-linear-to-b from-primary/10 to-transparent border border-primary/20 flex flex-col items-center justify-center gap-1 group-hover:scale-110 transition-transform duration-500">
                                <Coins className="w-10 h-10 text-primary animate-[bounce_2s_infinite]" />
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse delay-75" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse delay-150" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Automated Royalty Payments</h3>
                    </div>

                    {/* Item 3: IP Rights */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                            <div className="absolute w-28 h-28 rounded-xl border border-primary/10 rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
                            <div className="relative w-20 h-24 flex items-center justify-center bg-linear-to-b from-primary/20 to-primary/5 rounded-xl border border-primary/30 shadow-2xl shadow-primary/10">
                                <FileBadge className="w-14 h-14 text-primary relative z-10" />
                            </div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Intellectual Property Rights</h3>
                    </div>

                    {/* Item 4: Analytics */}
                    <div className="space-y-8 flex flex-col items-center text-center group">
                        <div className="h-40 w-full flex items-center justify-center relative">
                             <div className="absolute w-28 h-28 rounded-xl border border-primary/10 rotate-90 group-hover:rotate-90 transition-transform duration-1000" />
                            <div className="absolute bottom-10 flex items-end gap-1.5 px-4 h-12">
                                <div className="w-3 bg-primary/10 rounded-t-sm h-4 group-hover:h-8 transition-all duration-500 delay-0" />
                                <div className="w-3 bg-primary/20 rounded-t-sm h-6 group-hover:h-12 transition-all duration-500 delay-75" />
                                <div className="w-3 bg-primary/40 rounded-t-sm h-4 group-hover:h-10 transition-all duration-500 delay-150" />
                                <div className="w-3 bg-primary rounded-t-sm h-8 group-hover:h-14 transition-all duration-500 delay-300" />
                            </div>
                            {/* <div className="relative z-10 w-16 h-16 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-xl group-hover:translate-y-[-4px] transition-transform">
                                <BarChart3 className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                            </div> */}
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Comprehensive Sales Analytics</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
