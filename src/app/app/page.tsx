import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Smartphone, BookOpen, WifiOff, Download, LogIn, FolderSync as Sync, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { IBM_Plex_Sans } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function AppLandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pb-16 pt-48 md:pb-32">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-lg" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Text Content */}
                        <div className="flex-1 space-y-10 text-center lg:text-left">


                            <div className="space-y-6">
                                <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
                                    Your Library,
                                    <span className="block text-foreground/90">
                                        Anywhere, <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Securely.</span>
                                    </span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    The KwizHub App gives students offline access to their purchased materials while ensuring
                                    industry-leading content protection for authors.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <Button
                                    size="lg"
                                    className="w-auto text-base px-10 h-14 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all"
                                    disabled
                                >
                                    App Coming Soon
                                    <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4 text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>Offline</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>DRM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>Sync</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Phone UI */}
                        <div className="flex-1 w-full max-w-md relative group cursor-default">
                            {/* Ambient Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-lg -z-10 group-hover:bg-primary/30 transition-colors duration-1000" />

                            <div className="relative z-10 mx-auto w-72 h-[580px] bg-background/40 backdrop-blur-2xl rounded-[3.5rem] border-[6px] border-border/50 overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-700 ">
                                {/* Inner Screen Bezel */}
                                <div className="absolute inset-0 border-4 border-background/20 rounded-[3rem] pointer-events-none z-30" />

                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-black dark:bg-black rounded-lg z-40 flex items-center justify-between px-3 shadow-sm border border-white/5">
                                    <div className="w-2 h-2 rounded-lg bg-green-500/80 animate-pulse" />
                                    <div className="w-12 h-1 rounded-lg bg-white/10" />
                                </div>

                                {/* Screen Content */}
                                <div className="w-full h-full bg-linear-to-b from-background via-background to-primary/5 flex flex-col pt-16 px-6 pb-8 relative">

                                    {/* Background Grid Pattern */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)] pointer-events-none" />

                                    {/* Reader Header */}
                                    <div className="flex items-center justify-center mb-6 relative z-20 pt-2">
                                        <div className="flex items-center">
                                            <ArrowLeft />
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
                                        <div className="w-10 h-10 rounded-lg bg-background/80 border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer   duration-500 shadow-sm">
                                            <ArrowRight className="w-4 h-4 text-foreground rotate-180" />
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground font-mono">Pg 42 / 348</span>
                                        <div className="w-10 h-10 rounded-lg bg-primary border border-primary flex items-center justify-center transition-colors cursor-pointer duration-500 shadow-md shadow-primary/20">
                                            <ArrowRight className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className={`text-3xl md:text-5xl font-bold font-heading tracking-tight ${ibm_plex_sans.className}`}>
                            Perks of the App?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Designed for providing a seamless reading experience while protecting intellectual property.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "DRM Protection",
                                desc: "Advanced encryption ensures that content cannot be screenshotted, copied, or shared illegally. Your materials stay secure."
                            },
                            {
                                icon: WifiOff,
                                title: "Offline Access",
                                desc: "Download once, read anywhere. Perfect for studying on the go without data. Your library is always with you."
                            },
                            {
                                icon: Smartphone,
                                title: "Secure Reader",
                                desc: "A built-in PDF reader optimized for mobile screens with night mode, annotation support, and smooth scrolling."
                            }
                        ].map((feature, i) => (
                            <Card key={i} className="group border-border/40 bg-muted/20 hover:bg-muted/30 transition-all duration-300 rounded-lg overflow-hidden border-2">
                                <CardContent className="pt-10 pb-10 px-8">
                                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-8 border border-primary/20 transition-all duration-500">
                                        <feature.icon className="h-7 w-7 text-primary transition-colors" />
                                    </div>
                                    <h3 className={`text-xl font-bold font-heading mb-4 ${ibm_plex_sans.className}`}>{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-base">
                                        {feature.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-32 bg-muted/10 border-y border-border/40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className={`text-3xl md:text-5xl font-bold font-heading tracking-tight ${ibm_plex_sans.className}`}>
                            How to Get Started
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Get started with KwizHub Mobile in just a few simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 border-border/40 border-2 rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm">
                        {[
                            {
                                icon: Download,
                                title: "Download",
                                desc: "Available for Android and iOS (Coming Soon)."
                            },
                            {
                                icon: LogIn,
                                title: "Log In",
                                desc: "Use your KwizHub student credentials for instant access."
                            },
                            {
                                icon: Sync,
                                title: "Sync",
                                desc: "Your purchased books will appear automatically."
                            },
                            {
                                icon: BookOpen,
                                title: "Read",
                                desc: "Tap to download and read securely at any time."
                            }
                        ].map((item, i) => (
                            <div key={i} className={`flex flex-col gap-6 p-10 items-center text-center group transition-colors hover:bg-muted/30 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 2 ? 'border-b' : ''} border-border/40`}>
                                <div className="w-16 h-16 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center transition-transform  duration-500">
                                    <item.icon className="h-8 w-8 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className={`text-xl font-bold font-heading ${ibm_plex_sans.className}`}>{item.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
                    <div className="space-y-4">
                        <h2 className={`text-4xl md:text-6xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
                            Ready to Study <br />
                            <span className="text-primary">Anywhere?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Take your study materials with you wherever you go.
                            Available soon on iOS and Android.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/marketplace" className="w-full sm:w-auto">
                            <Button size="lg" className="w-auto text-base px-10 h-14 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all shadow-xl shadow-primary/5">
                                Browse Materials
                                <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
