import Link from "next/link";
import { BookOpen, ShoppingBag, Shield, Mail, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="border-t border-border/40 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold font-heading text-foreground leading-none">KwizHub</span>
                                <span className="text-[10px] text-muted-foreground leading-none">Academic Excellence</span>
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            Your trusted marketplace for quality academic materials, past questions, and study resources. 
                            Empowering students to excel in their academic journey.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                <Github className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <h3 className="font-semibold font-heading mb-4 text-foreground">Platform</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/marketplace"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                                >
                                    <ShoppingBag className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Marketplace</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/app"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                                >
                                    <BookOpen className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Mobile App</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/signup"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-2">
                        <h3 className="font-semibold font-heading mb-4 text-foreground">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Authors */}
                    <div className="md:col-span-2">
                        <h3 className="font-semibold font-heading mb-4 text-foreground">For Authors</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/signup"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Become an Author
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Author Guidelines
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Security Badge */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold font-heading text-foreground">Secure Platform</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your data and transactions are protected with industry-standard security measures.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/40 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            &copy; {new Date().getFullYear()} KwizHub. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                Terms
                            </Link>
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                Privacy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
