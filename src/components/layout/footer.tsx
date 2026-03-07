import Link from "next/link";
import { Twitter } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <p className="hidden md:block text-sm text-zinc-500">
                        &copy; {new Date().getFullYear()} KwizHub
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm">
                    <Link href="/marketplace" className="text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg px-3 py-2 hover:bg-white/5">Marketplace</Link>
                    <Link href="/authors" className="text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg px-3 py-2 hover:bg-white/5">Authors</Link>
                    <Link href="/legal?tab=terms" className="text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg px-3 py-2 hover:bg-white/5">Terms</Link>
                    <Link href="/legal?tab=privacy" className="text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-lg px-3 py-2 hover:bg-white/5">Privacy</Link>
                    <Link href="https://twitter.com/xyz_07hb" className="text-zinc-500 hover:text-white transition-colors cursor-pointer rounded-lg p-2 hover:bg-white/5 md:ml-2">
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-4 w-4" />
                    </Link>
                </div>

                <p className="md:hidden text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} KwizHub
                </p>
            </div>
        </footer>
    );
}
