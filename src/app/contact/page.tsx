"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, Globe, MapPin, Phone } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        (e.target as HTMLFormElement).reset();
        setLoading(false);
    }

    return (
        <div className={`min-h-screen flex flex-col bg-background ${ibm_plex_sans.className}`}>
            <Navbar />

            <main className="flex-1 pt-32 pb-16 md:pt-48 md:pb-32 relative overflow-hidden">
                {/* Background Effects (Matching Home Page) */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left Side: Content */}
                        <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-semibold text-primary uppercase tracking-wider">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Get in Touch</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                                    Let&apos;s Start a <br />
                                    <span className="text-primary italic">Conversation.</span>
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                                    Have questions about our Marketplace? Need technical support?
                                    Our team is here to help you excel in your academic journey.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Email Our Company</h3>
                                        <p className="text-sm text-muted-foreground">inbox@qlabs.space</p>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Call Us</h3>
                                        <p className="text-sm text-muted-foreground">+234 (0) 915-3278-723</p>
                                    </div>
                                </div>


                                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Support Hours</h3>
                                        <p className="text-sm text-muted-foreground">Mon - Fri, 9am - 5pm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                required
                                                className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                required
                                                className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                            Subject
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            placeholder="How can we help?"
                                            required
                                            className="py-6 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                            Your Message
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us what's on your mind..."
                                            required
                                            className="min-h-[150px] rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/50 resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full rounded-xl py-7 font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending Message..." : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-32 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked <span className="text-primary italic">Questions</span></h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                Quick answers to common questions about KwizHub and our academic marketplace.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
                            <AccordionItem value="item-1" className="border-none bg-card/40 backdrop-blur-md rounded-3xl px-8 hover:border-primary/20 transition-all">
                                <AccordionTrigger className="text-lg font-bold py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        How do I access my purchased materials?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-6">
                                    Once your purchase is complete, materials are instantly added to your digital library. You can find them under 'My Materials' in your user dashboard.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border-none bg-card/40 backdrop-blur-md rounded-3xl px-8 hover:border-primary/20 transition-all">
                                <AccordionTrigger className="text-lg font-bold py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        What payment methods do you accept?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-6">
                                    We currently support major debit cards and bank transfers through our secure payment gateway (Paystack).
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border-none bg-card/40 backdrop-blur-md rounded-3xl px-8 hover:border-primary/20 transition-all">
                                <AccordionTrigger className="text-lg font-bold py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Can I sell my own study materials?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-6">
                                    Yes! Students can apply to become authors. Once approved, you can upload your verified study materials and earn on every sale.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border-none bg-card/40 backdrop-blur-md rounded-3xl px-8 hover:border-primary/20 transition-all">
                                <AccordionTrigger className="text-lg font-bold py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Is there a refund policy?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-6">
                                    Due to the digital nature of materials, we typically don't offer refunds. However, if there's a technical issue, our support team is happy to help.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
