import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
                        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
                            <span>New Mobile App</span>
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
                                <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative z-10 mx-auto w-72 h-[580px] bg-card rounded-[3rem] border-2 border-border shadow-2xl overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-card rounded-b-2xl border-x-2 border-b-2 border-border z-20" />
                            <div className="w-full h-full bg-linear-to-br from-background via-background/95 to-primary/10 flex flex-col items-center justify-center p-8 text-center space-y-8">
                                <div className="w-24 h-24 bg-linear-to-br from-primary to-primary/80 rounded-4xl flex items-center justify-center shadow-xl shadow-primary/20">
                                    <span className="text-5xl font-bold text-primary-foreground">K</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className={`font-bold text-3xl font-heading ${ibm_plex_sans.className}`}>KwizHub</h3>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">Mobile Reader</p>
                                </div>
                                <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden">
                                    <div className="w-4/5 h-full bg-primary" />
                                </div>
                                <Button className="w-full h-12 rounded-full shadow-md bg-primary hover:bg-primary/90">
                                    Download
                                </Button>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px] rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
