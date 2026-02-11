import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function Stats() {
    return (
        <section className="py-24 bg-background border-t border-border/40 px-7">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
                        <span>What We Do?</span>
                    </div>
                    <h2 className={`text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight ${ibm_plex_sans.className}`}>
                        Empowering Students to <br className="hidden sm:block" />
                        Achieve Academic Excellence
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We provide a robust marketplace for students to access high-quality study materials,
                        connecting learners with verified educators across all departments.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-0">
                    <div className="text-center space-y-4 lg:border-r border-border/40 py-4 px-2">
                        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary">1K+</div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Study Materials</div>
                    </div>
                    <div className="text-center space-y-4 lg:border-r border-border/40 py-4 px-2">
                        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary">500+</div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Happy Students</div>
                    </div>
                    <div className="text-center space-y-4 lg:border-r border-border/40 py-4 px-2">
                        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary">50+</div>
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Verified Authors</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
