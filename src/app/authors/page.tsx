import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getAuthors } from "@/app/actions/authors";
import { IBM_Plex_Sans } from "next/font/google";
import { User, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default async function AuthorsPage() {
    const authors = await getAuthors();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-24">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
                            <span>Our Community</span>
                        </div>
                        <h1 className={`text-4xl md:text-6xl font-bold font-heading tracking-tight leading-tight ${ibm_plex_sans.className}`}>
                            Verified <span className="text-primary">Authors</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Meet the educators and contributors providing premium academic materials on KwizHub.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {authors.map((author) => (
                            <div
                                key={author.id}
                                className="relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-300"
                            >
                                <div className="p-6 space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-primary transition-colors duration-300">
                                        <User className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold font-heading truncate">{author.name}</h3>
                                        <p className="text-sm text-muted-foreground">@{author.username}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg w-fit">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{author._count.materials} Material{author._count.materials == 1 ? "Material" : "Materials"}</span>
                                    </div>
                                </div>

                                <div className="px-6 pb-6">
                                    <Link href={`/authors/${author.id}`}>
                                        <Button className="group w-full rounded-xl gap-2 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground cursor-pointer">
                                            View Details
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300  group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {authors.length === 0 && (
                        <div className="text-center py-24 border border-dashed border-border/50 rounded-3xl">
                            <p className="text-xl text-muted-foreground">No authors found yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
