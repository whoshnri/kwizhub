import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function FinalCTA() {
    return (
        <section className="relative py-32 overflow-hidden px-10">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
                <div className="space-y-4">
                    <h2 className={`text-4xl md:text-6xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
                        Ready to Excel in <br />
                        Your <span className="text-primary">Studies?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Join thousands of students improving their grades with verified materials.
                        Start your journey to academic excellence today.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/signup" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all shadow-xl shadow-primary/5">
                            Create Free Account
                            <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/marketplace" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-10 h-14 rounded-full border-2 transition-all">
                            Explore Materials
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
