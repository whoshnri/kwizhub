"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("You've been added to the waitlist!");
    };

    return (
        <div className="w-full max-w-md mx-auto relative group">
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div className="relative">
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-14 px-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:ring-primary/20 focus:border-primary/30 transition-all backdrop-blur-xl"
                            />
                            <motion.div
                                className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold group relative overflow-hidden transition-all shadow-xl shadow-white/5"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join the Elite Waitlist
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </span>
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-[2.5rem] bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 text-center space-y-4 backdrop-blur-2xl"
                    >
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold font-heading text-white">You're on the list!</h3>
                            <p className="text-zinc-400 text-sm">
                                We'll notify you as soon as we're ready for takeoff.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>
    );
}
