import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                            <span className="text-xl font-bold">KwizHub</span>
                        </div>
                        <p className="text-primary-foreground/80 max-w-md">
                            Your trusted marketplace for quality academic materials, past questions,
                            and study resources. Empowering students to excel.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-primary-foreground/80 hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/marketplace"
                                    className="text-primary-foreground/80 hover:text-white transition-colors"
                                >
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-primary-foreground/80 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/signup"
                                    className="text-primary-foreground/80 hover:text-white transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-primary-foreground/80 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-primary-foreground/80 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-8 pt-8 text-center text-primary-foreground/60">
                    <p>&copy; {new Date().getFullYear()} KwizHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
