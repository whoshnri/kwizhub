import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Mail, Phone } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function ContactPage() {
    return (
        <div className={`min-h-screen flex flex-col bg-background ${ibm_plex_sans.className}`}>
            <Navbar />

            <main className="flex-1 pt-32 pb-16 md:pt-48 md:pb-32 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Get in <span className="text-primary italic">Touch</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Have a question or need support? Reach us directly.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <div className="flex items-start gap-5 p-6 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors duration-300">
                            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-foreground">Email</h3>
                                <p className="text-sm text-muted-foreground">support@kwizhub.app</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 p-6 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors duration-300">
                            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-foreground">Phone</h3>
                                <p className="text-sm text-muted-foreground">+234 (0) 915-3278-723</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
