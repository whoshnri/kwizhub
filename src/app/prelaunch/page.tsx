"use client";

import { WaitlistForm } from "@/components/landing/waitlist-form";
import { IBM_Plex_Sans } from "next/font/google";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function PrelaunchPage() {
    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col items-center overflow-x-hidden">
            {/* Absolute Background Elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] px-2 shadow-inner" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[150px] rounded-full opacity-50" />
            </div>

            <main className="relative z-10 w-full">
                {/* Prelaunch Hero */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32">
                    {/* Logo / Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                                <span className="text-black font-extrabold text-2xl">K</span>
                            </div>
                            <span className={`text-2xl font-bold tracking-tight text-white ${ibm_plex_sans.className}`}>KwizHub</span>
                        </div>
                    </motion.div>

                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <span>Coming Soon</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-6"
                        >
                            <h1 className={`text-5xl md:text-8xl font-black font-heading tracking-tight leading-[0.9] ${ibm_plex_sans.className}`}>
                                Academic <br />
                                <span className="bg-linear-to-r from-primary via-white to-primary bg-clip-text text-transparent">Powerhouse</span><br />
                                is Loading.
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                Unlock the ultimate marketplace for verified academic resources.
                                We're building the future of learning, one material at a time.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="pt-8"
                        >
                            <WaitlistForm />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="pt-24 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12"
                        >
                            <div className="space-y-1">
                                <p className="text-3xl font-bold font-heading text-primary">1K+</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Materials</p>
                            </div>
                            <div className="space-y-1 text-center md:text-left">
                                <p className="text-3xl font-bold font-heading text-white">500+</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pre-Users</p>
                            </div>
                            <div className="space-y-1 text-center md:text-left col-span-2 md:col-span-1">
                                <p className="text-3xl font-bold font-heading text-white">50+</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Verified Authors</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Featured Preview Section */}
                <section className="py-32 bg-zinc-950/50 border-t border-white/5 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mb-20 space-y-4"
                        >
                            <h2 className={`text-3xl md:text-5xl font-bold font-heading ${ibm_plex_sans.className}`}>Why wait for KwizHub?</h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-12 text-left">
                            {[
                                { title: 'Exclusivity', desc: 'Get early access to premium verified materials before anyone else.' },
                                { title: 'Verified Only', desc: 'Every material is vetted by experts to ensure top-tier quality.' },
                                { title: 'Seamless UI', desc: 'Experience the smoothest academic portal ever designed.' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                                    className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
                                >
                                    <h3 className="text-xl font-bold font-heading mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing */}
                <footer className="py-32 text-center px-6 border-t border-white/5 bg-zinc-950">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Empowering Excellence</p>
                        <div className="flex items-center justify-center gap-4 text-xs font-bold text-zinc-500">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <span className="text-zinc-800">•</span>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <span className="text-zinc-800">•</span>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                        <p className="text-sm font-medium text-white/30">&copy; {new Date().getFullYear()} KwizHub. Built for the ambitious.</p>
                    </motion.div>
                </footer>
            </main>
        </div>
    );
}
