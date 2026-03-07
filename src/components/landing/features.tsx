import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Coins, FileBadge, BarChart3, ArrowRight, ShieldCheck } from "lucide-react";
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
                                <Button className="rounded-lg px-8 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                                    Become an Author
                                    <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-12">
                    {/* Item 1: Global Distribution */}
                    <div className="space-y-6 flex flex-col items-center text-center group cursor-default">
                        <div className="h-48 w-full flex items-center justify-center relative">
                            {/* Ambient Glow */}
                            <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 group-hover:scale-125 transition-all duration-700" />

                            {/* Orbit Rings */}
                            <div className="absolute w-40 h-40 rounded-full border border-foreground/5 dark:border-white/5 bg-linear-to-tr from-transparent to-primary/5 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
                            <div className="absolute w-32 h-32 rounded-full border border-primary/20 border-dotted group-hover:-rotate-90 transition-transform duration-1000" />

                            {/* Center Container */}
                            <div className="relative w-20 h-20 rounded-2xl bg-background/50 backdrop-blur-xl border border-primary/20 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                                <Globe className="w-8 h-8 text-primary relative z-10" />

                                {/* Decorative Dots */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                                <div className="absolute bottom-2 -left-1.5 w-2 h-2 rounded-full border border-primary bg-background" />
                            </div>

                            {/* Floating Elements outside */}
                            <div className="absolute top-8 left-[20%] w-6 h-6 rounded-lg bg-background/50 backdrop-blur-md border border-border flex items-center justify-center group-hover:-translate-y-4 group-hover:-translate-x-2 transition-transform duration-700 delay-100">
                                <IconNetwork className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <div className="absolute bottom-6 right-[20%] w-8 h-8 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center group-hover:translate-y-3 group-hover:translate-x-2 transition-transform duration-700">
                                <Globe className="w-3 h-3 text-primary/50" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Global Content Distribution</h3>
                    </div>

                    {/* Item 2: Royalties */}
                    <div className="space-y-6 flex flex-col items-center text-center group cursor-default">
                        <div className="h-48 w-full flex items-center justify-center relative">
                            <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 group-hover:scale-125 transition-all duration-700" />

                            {/* Chart/data background */}
                            <div className="absolute w-36 h-24 border-b border-l border-primary/20 flex items-end gap-2 px-2 pb-0.5 group-hover:scale-105 transition-transform duration-700">
                                <div className="w-full bg-primary/10 rounded-t-sm h-1/3 group-hover:h-1/2 transition-all duration-700 delay-75" />
                                <div className="w-full bg-primary/20 rounded-t-sm h-1/2 group-hover:h-3/4 transition-all duration-700 delay-150" />
                                <div className="w-full bg-primary/30 rounded-t-sm h-3/4 group-hover:h-full transition-all duration-700 delay-300" />
                                <div className="w-full bg-primary/50 rounded-t-sm h-full group-hover:h-[110%] transition-all duration-700 delay-500" />
                            </div>

                            <div className="relative w-20 h-20 rounded-2xl bg-background/80 backdrop-blur-xl border border-primary/20 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 z-10">
                                <Coins className="w-8 h-8 text-primary" />
                            </div>

                            {/* Floating Coins */}
                            <div className="absolute top-10 right-[25%] opacity-0 group-hover:opacity-100 group-hover:-translate-y-8 transition-all duration-700">
                                <Coins className="w-4 h-4 text-primary/60" />
                            </div>
                            <div className="absolute top-16 right-[15%] opacity-0 group-hover:opacity-100 group-hover:-translate-y-6 transition-all duration-700 delay-100">
                                <Coins className="w-3 h-3 text-primary/40" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Automated Royalty Payments</h3>
                    </div>  

                    {/* Item 3: IP Rights */}
                    <div className="space-y-6 flex flex-col items-center text-center group cursor-default">
                        <div className="h-48 w-full flex items-center justify-center relative">
                            <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 group-hover:scale-125 transition-all duration-700" />

                            {/* Shield background */}
                            <div className="absolute w-36 h-36 rounded-full border border-primary/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
                                <div className="w-28 h-28 rounded-full border border-primary/20" />
                                <div className="absolute w-full h-[1px] bg-primary/20" />
                                <div className="absolute h-full w-[1px] bg-primary/20" />
                            </div>

                            {/* Document Container */}
                            <div className="relative w-16 h-20 rounded-lg bg-background/80 backdrop-blur-xl border-2 border-primary/30 shadow-2xl flex flex-col items-center justify-center gap-2 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 z-10">
                                <div className="w-8 h-1 bg-primary/20 rounded-full" />
                                <div className="w-6 h-1 bg-primary/20 rounded-full" />
                                <FileBadge className="w-6 h-6 text-primary mt-1" />

                                {/* Stamp */}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Intellectual Property Rights</h3>
                    </div>

                    {/* Item 4: Secure App */}
                    <div className="space-y-6 flex flex-col items-center text-center group cursor-default">
                        <div className="h-48 w-full flex items-center justify-center relative">
                            <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 group-hover:scale-125 transition-all duration-700" />

                            {/* Grid Pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.05)_1px,transparent_1px)] bg-size-[10px_10px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Phone Frame */}
                            <div className="relative w-15 h-26 rounded-2xl scale-105 bg-background/80 backdrop-blur-xl border-2 border-primary/30 shadow-2xl flex flex-col items-center p-1.5 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 z-10">
                                {/* Notch */}
                                <div className="w-4 h-1 rounded-full bg-border mb-2" />

                                {/* Phone Screen Grid */}
                                <div className="w-full h-full rounded-sm bg-primary/10 border border-primary/20 flex flex-col gap-1 p-1">
                                    <div className="w-full h-1 bg-primary/20 rounded-sm delay-100 duration-500 group-hover:bg-primary/40" />
                                    <div className="w-3/4 h-1 bg-primary/20 rounded-sm delay-200 duration-500 group-hover:bg-primary/40" />
                                    <div className="w-full h-1 bg-primary/20 rounded-sm delay-300 duration-500 group-hover:bg-primary/40" />
                                    <div className="w-5/6 h-1 bg-primary/20 rounded-sm delay-500 duration-500 group-hover:bg-primary/40" />
                                </div>

                                {/* Floating Lock */}
                                <div className="absolute -right-3 top-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:-translate-y-2 group-hover:translate-x-1 transition-transform duration-500">
                                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading px-4">Secure Reading App</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
