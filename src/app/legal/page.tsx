"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IBM_Plex_Sans } from "next/font/google";
import { ShieldCheck, FileText, Scale, Lock } from "lucide-react";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

function LegalContent() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") === "privacy" ? "privacy" : "terms";

    return (
        <main className="flex-1 pt-32 pb-16 md:pt-48 md:pb-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center space-y-4 mb-16 animate-in fade-in duration-1000">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-semibold text-primary uppercase tracking-wider">
                        <Scale className="w-4 h-4" />
                        <span>Legal Center</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Trust & <span className="text-primary italic">Transparency.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We believe in being clear and open about our terms and how we protect your privacy.
                    </p>
                </div>

                <Tabs defaultValue={defaultTab} className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <TabsList className="grid w-full h-full grid-cols-2 max-w-md mx-auto mb-12 p-1 bg-muted/50 backdrop-blur-md rounded-2xl border border-border/50">
                        <TabsTrigger value="terms" className="rounded-xl py-2 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            <FileText className="w-4 h-4" />
                            Terms of Service
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="rounded-xl py-2 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            <Lock className="w-4 h-4" />
                            Privacy Policy
                        </TabsTrigger>
                    </TabsList>

                    <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 min-h-[600px]">
                        <TabsContent value="terms" className="mt-0 focus-visible:outline-hidden">
                            <div className="space-y-10">
                                <div className="flex items-center justify-between pb-6 border-b border-border/40">
                                    <h2 className="text-2xl font-bold">Terms of Service</h2>
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
                                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-400 leading-relaxed">
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">1</div>
                                            Acceptance of Terms
                                        </h3>
                                        <p>
                                            By accessing and using KwizHub, you accept and agree to be bound by these
                                            Terms of Service. If you do not agree to these terms, please do not use
                                            our service.
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">2</div>
                                            User Accounts
                                        </h3>
                                        <p>
                                            You are responsible for maintaining the confidentiality of your account
                                            credentials and for all activities that occur under your account. You must
                                            notify us immediately of any unauthorized use.
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">3</div>
                                            Content and Materials
                                        </h3>
                                        <p>
                                            Authors retain ownership of their uploaded materials. By uploading content,
                                            you grant KwizHub a license to display and distribute the materials through
                                            our platform. You represent that you have the right to upload and sell
                                            any materials you provide.
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">4</div>
                                            Purchases and Refunds
                                        </h3>
                                        <p>
                                            All purchases are final. Due to the digital nature of our products, we
                                            generally do not offer refunds. However, we may consider refund requests
                                            on a case-by-case basis for technical issues or incorrect content.
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">5</div>
                                            Prohibited Activities
                                        </h3>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Share or redistribute purchased materials without authorization</li>
                                            <li>Upload copyrighted content without permission</li>
                                            <li>Use the platform for illegal activities</li>
                                            <li>Attempt to compromise the security of the platform</li>
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="privacy" className="mt-0 focus-visible:outline-hidden">
                            <div className="space-y-10">
                                <div className="flex items-center justify-between pb-6 border-b border-border/40">
                                    <h2 className="text-2xl font-bold">Privacy Policy</h2>
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
                                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-zinc-400 leading-relaxed">
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                            Information We Collect
                                        </h3>
                                        <p>
                                            We collect information you provide directly to us, such as when you create
                                            an account, make a purchase, or contact us for support. This includes:
                                        </p>
                                        <ul className="grid sm:grid-cols-2 gap-3 list-none pl-0">
                                            {['Name and email address', 'Username and password', 'Payment information', 'Purchase history'].map((item) => (
                                                <li key={item} className="flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border/20 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-primary" />
                                            How We Use Your Information
                                        </h3>
                                        <p>
                                            We use the information we collect to provide, maintain, and improve our services,
                                            process transactions, and protect against fraudulent activity.
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            Data Security
                                        </h3>
                                        <p>
                                            We implement appropriate security measures to protect your personal
                                            information. However, no method of transmission over the Internet is
                                            100% secure.
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </main>
    );
}

export default function LegalPage() {
    return (
        <div className={`min-h-screen flex flex-col bg-background ${ibm_plex_sans.className}`}>
            <Navbar />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
                <LegalContent />
            </Suspense>
            <Footer />
        </div>
    );
}
