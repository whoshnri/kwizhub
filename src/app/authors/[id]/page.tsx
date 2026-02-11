import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getAuthorById } from "@/app/actions/authors";
import { IBM_Plex_Sans } from "next/font/google";
import { User, BookOpen, Calendar, BadgeCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default async function AuthorDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const author = await getAuthorById(id);

    if (!author) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 pt-32 pb-16 md:pt-48 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Author Header */}
                    <div className="relative mb-12 bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full" />

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-4xl flex items-center justify-center border-4 border-background ">
                                <User className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className={`text-3xl md:text-5xl font-bold font-heading ${ibm_plex_sans.className}`}>
                                        {author.name}
                                    </h1>
                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 gap-1 rounded-full px-4 py-1">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Verified Author
                                    </Badge>
                                </div>
                                <p className="text-xl text-muted-foreground font-medium">@{author.username}</p>

                                <div className="flex flex-wrap gap-6 pt-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4.5 w-4.5" />
                                        <span className="text-sm">Joined {new Date(author.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BookOpen className="h-4.5 w-4.5" />
                                        <span className="text-sm font-semibold text-foreground">{author._count.materials}</span>
                                        <span className="text-sm text-muted-foreground">Materials Published</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Materials Section */}
                    <div className="space-y-8">
                        <div>
                            <h2 className={`text-3xl font-bold font-heading ${ibm_plex_sans.className}`}>Published Materials</h2>
                            <p className="text-muted-foreground mt-2">Browse quality resources uploaded by this author.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {author.materials.map((material) => (
                                <div
                                    key={material.id}
                                    className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/20 text-primary">
                                                {material.category}
                                            </Badge>
                                            <span className="font-bold text-lg text-primary">₦{material.price.toLocaleString()}</span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold font-heading line-clamp-1">{material.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{material.course}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pb-2">
                                            <div className="bg-muted/30 p-2 rounded-lg text-center">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Level</p>
                                                <p className="text-xs font-semibold">{material.level}</p>
                                            </div>
                                            <div className="bg-muted/30 p-2 rounded-lg text-center">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Semester</p>
                                                <p className="text-xs font-semibold underline decoration-primary/30">{material.semester}</p>
                                            </div>
                                        </div>

                                        <Link href={`/marketplace?materialId=${material.id}`}>
                                            <Button className="w-full group cursor-pointer rounded-xl gap-2 transition-all duration-300">
                                                View in Marketplace
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {author.materials.length === 0 && (
                            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                                <p className="text-muted-foreground">No materials found for this author yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
