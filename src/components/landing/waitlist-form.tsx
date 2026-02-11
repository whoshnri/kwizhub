"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const lastSignup = localStorage.getItem("kwizhub_last_signup");
        const oneHour = 60 * 60 * 1000;
        if (lastSignup && Date.now() - parseInt(lastSignup) < oneHour) {
            setIsSubmitted(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_WAITLIST_URL || "", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
                mode: "no-cors",
            });

            localStorage.setItem("kwizhub_last_signup", Date.now().toString());
            setIsSubmitted(true);
            toast.success("You've been added to the waitlist!");
        } catch (error) {
            console.error("Waitlist error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mx-auto relative group">
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
                        <div className="relative flex h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:ring-primary/20 focus:border-primary/30 transition-all backdrop-blur-xl overflow-hidden">
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-full focus:ring-none focus:border-none border-none active:border-none rounded-none"
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-15 h-14 rounded-none bg-white text-black hover:bg-zinc-200 font-bold group relative overflow-hidden transition-all"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />

                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="h-4 w-4 transition-transform " />
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>

                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-xl w-full bg-gray-900 text-center space-y-4 mx-auto"
                    >
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                            <Check className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold font-heading text-white">You're on the list!</h3>
                            <p className="text-zinc-400 text-sm">
                                You'll hear from us soon.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
