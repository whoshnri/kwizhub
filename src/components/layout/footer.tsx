import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-10 py-24 pb-12">
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-8 max-w-md">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:rotate-12">
                                <span className="text-black font-bold text-base">K</span>
                            </div>
                            <span className={`text-xl font-bold tracking-tight text-white ${ibm_plex_sans.className}`}>KwizHub</span>
                        </Link>
                        <p className="text-zinc-400 text-base leading-relaxed">
                            Your trusted marketplace for premium academic materials.
                            Empowering students to excel in their educational journey with verified resources.
                        </p>
                        <div className="flex items-center gap-5 pt-2">
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 flex-1">
                        {/* Platform */}
                        <div className="space-y-6">
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 ${ibm_plex_sans.className}`}>Platform</h3>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Marketplace', href: '/marketplace' },
                                    { name: 'Sign In', href: '/login' },
                                    { name: 'Sign Up', href: '/signup' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="space-y-6">
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 ${ibm_plex_sans.className}`}>Resources</h3>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Terms of Service', href: '/legal?tab=terms' },
                                    { name: 'Privacy Policy', href: '/legal?tab=privacy' },
                                    { name: 'Contact Support', href: '/contact' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter / Stay Updated */}
                        <div className="space-y-6 col-span-2 lg:col-span-2">
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 ${ibm_plex_sans.className}`}>Stay Updated</h3>
                            <div className="space-y-4">
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                    Join our mailing list to receive the latest academic materials and platform updates.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-hidden focus:ring-1 focus:ring-white/20 transition-all w-full sm:max-w-[240px]"
                                    />
                                    <button className="h-10 px-6 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                                        Join
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-medium">
                                    By joining, you agree to our <Link href="/legal?tab=privacy" className="underline hover:text-zinc-400 decoration-zinc-700">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-zinc-500">
                        &copy; {new Date().getFullYear()} KwizHub. Built for Academic Excellence.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">
                            English
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />

                    </div>
                </div>
            </div>
        </footer>
    );
}
