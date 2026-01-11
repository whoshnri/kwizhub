import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Smartphone, BookOpen, WifiOff, Download, LogIn, FolderSync as Sync, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function AppLandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 border-b border-border/40">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Mobile App Available</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-bold font-heading leading-tight">
                                    Your Library,
                                    <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                        Anywhere, Securely.
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
                                    variant="outline" 
                                    className="text-base px-8 h-12 border-2 w-full sm:w-auto"
                                    disabled
                                >
                                    Download App
                                    <Download className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>Offline Reading</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>DRM Protected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>Secure Sync</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Phone UI */}
                        <div className="flex-1 w-full max-w-md relative">
                            <div className="relative w-[320px] h-[640px] mx-auto bg-gradient-to-br from-card to-card/50 rounded-[3rem] border-2 border-border shadow-2xl overflow-hidden backdrop-blur-sm">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-card rounded-b-2xl border-x-2 border-b-2 border-border z-20" />

                                {/* Screen Content */}
                                <div className="w-full h-full bg-gradient-to-br from-background to-muted/30 flex flex-col relative">
                                    {/* App Header */}
                                    <div className="px-6 pt-14 pb-5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-lg font-heading">My Library</span>
                                            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-primary-foreground/80">Hello, Student</p>
                                    </div>

                                    {/* Books Grid */}
                                    <div className="flex-1 p-5 grid grid-cols-2 gap-4 overflow-y-auto">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                                                <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-xl shadow-md w-full relative group overflow-hidden border border-border/50">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                                                    </div>
                                                    {i === 1 && (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                                                            <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                                                                <WifiOff className="h-3 w-3" />
                                                                <span>Offline Ready</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="h-2.5 bg-muted rounded w-3/4"></div>
                                                <div className="h-2 bg-muted/50 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Floating Action Button */}
                                    <div className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground cursor-pointer hover:scale-110 transition-transform">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[100px] rounded-full -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading">
                            Why Use the App?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Designed for providing a seamless reading experience while protecting intellectual property.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                            <CardContent className="pt-8 pb-8 px-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <ShieldCheck className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold font-heading mb-3">DRM Protection</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Advanced encryption ensures that content cannot be screenshotted, copied, or shared illegally. 
                                    Your materials stay secure.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                            <CardContent className="pt-8 pb-8 px-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <WifiOff className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold font-heading mb-3">Offline Access</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Download once, read anywhere. Perfect for studying on the go without data. 
                                    Your library is always with you.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                            <CardContent className="pt-8 pb-8 px-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <Smartphone className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold font-heading mb-3">Secure Reader</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    A built-in PDF reader optimized for mobile screens with night mode, 
                                    annotation support, and smooth scrolling.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 bg-muted/30 border-y border-border/40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading">
                            How to Get Started
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get started with KwizHub Mobile in just a few simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 md:grid-rows-2 items-center  border-2 rounded-3xl overflow-hidden">
                        {[
                            { 
                                step: 1, 
                                icon: Download,
                                title: "Download the App", 
                                desc: "Available for Android and iOS (Coming Soon). Get it from your app store." 
                            },
                            { 
                                step: 2, 
                                icon: LogIn,
                                title: "Log In", 
                                desc: "Use your KwizHub student credentials to access your account." 
                            },
                            { 
                                step: 3, 
                                icon: Sync,
                                title: "Sync Library", 
                                desc: "Your purchased books will appear automatically. Everything stays in sync." 
                            },
                            { 
                                step: 4, 
                                icon: BookOpen,
                                title: "Read Offline", 
                                desc: "Tap to download and read securely. Your materials are always available." 
                            }
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="flex flex-col gap-6 p-4 py-10 hover:bg-gray-800/10 items-center group text-center border">
                                    <div className="relative">
                                        <div className="w-14 border h-14 rounded-xl text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0 transition-transform">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="pt-1 px-6">
                                        <h4 className="text-xl font-semibold font-heading mb-2">{item.title}</h4>
                                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading">
                        Ready to Study Anywhere?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Download the KwizHub mobile app and take your study materials with you wherever you go. 
                        Available soon on iOS and Android.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/marketplace">
                            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2">
                                Browse Materials
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
