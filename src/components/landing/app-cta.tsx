import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function AppCTA() {
    return (
        <section className="py-24 bg-background relative overflow-hidden px-7">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-1.5 text-sm font-medium text-primary">
                            <span>Mobile App</span>
                        </div>
                        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-[1.1] tracking-tight ${ibm_plex_sans.className}`}>
                            Study On The Go <br />
                            With The <span className="text-primary">KwizHub App</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                            Download your academic materials for offline access. Enjoy a distraction-free reading experience with built-in security features and seamless synchronization across all devices.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link href="/app" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative group cursor-default">
                        {/* Ambient Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full -z-10 group-hover:bg-primary/30 transition-colors duration-1000" />

                        <div className="relative z-10 mx-auto w-72 h-[580px] bg-background/40 backdrop-blur-2xl rounded-[3.5rem] border-[6px] border-border/50 overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-700 ">
                            {/* Inner Screen Bezel */}
                            <div className="absolute inset-0 border-4 border-background/20 rounded-[3rem] pointer-events-none z-30" />

                            {/* Dynamic Island / Notch */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-black dark:bg-black rounded-full z-40 flex items-center justify-between px-3 shadow-sm border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse" />
                                <div className="w-12 h-1 rounded-full bg-white/10" />
                            </div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-linear-to-b from-background via-background to-primary/5 flex flex-col pt-16 px-6 pb-8 relative">

                                {/* Background Grid Pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)] pointer-events-none" />

                                {/* Reader Header */}
                                <div className="flex items-center justify-center mb-6 relative z-20 pt-2">
                                    <div className="flex items-center">
                                        <ArrowLeft/>
                                        <span className={`text-sm font-bold font-heading text-foreground text-center flex-1 truncate px-4 leading-tight ${ibm_plex_sans.className}`}>Advanced Microeconomics</span>
                                    </div>
                                </div>

                                {/* Skeletal Book Content */}
                                <div className="flex-1 flex flex-col gap-5 relative z-20 px-1 mt-2">
                                    {/* Paragraph 1 - Title + Text */}
                                    <div className="space-y-3">
                                        <div className="w-2/3 h-4 bg-foreground/80 rounded-sm mb-4" />
                                        <div className="w-full h-2.5 bg-muted-foreground/30 rounded-sm" />
                                        <div className="w-11/12 h-2.5 bg-muted-foreground/30 rounded-sm" />
                                        <div className="w-full h-2.5 bg-muted-foreground/30 rounded-sm" />
                                        <div className="w-4/5 h-2.5 bg-muted-foreground/30 rounded-sm" />
                                    </div>

                                    {/* Paragraph 2 - Image block + Text */}
                                    <div className="space-y-3 pt-2">
                                        <div className="w-full h-24 bg-primary/5 border border-primary/10 rounded-lg mb-4 flex items-center justify-center">
                                            <div className="w-10 h-10 border-2 border-dashed border-primary/20 rounded-md flex items-center justify-center">
                                                <div className="w-4 h-4 bg-primary/20 rounded-sm" />
                                            </div>
                                        </div>
                                        <div className="w-full h-2.5 bg-muted-foreground/30 rounded-sm" />
                                        <div className="w-5/6 h-2.5 bg-muted-foreground/30 rounded-sm" />
                                        <div className="w-full h-2.5 bg-muted-foreground/30 rounded-sm" />
                                    </div>
                                </div>

                                {/* Bottom Navigation */}
                                <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-5 relative z-20">
                                    <div className="w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer   duration-500 shadow-sm">
                                        <ArrowRight className="w-4 h-4 text-foreground rotate-180" />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground font-mono">Pg 42 / 348</span>
                                    <div className="w-10 h-10 rounded-full bg-primary border border-primary flex items-center justify-center transition-colors cursor-pointer duration-500 shadow-md shadow-primary/20">
                                        <ArrowRight className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
