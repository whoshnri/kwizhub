import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getMaterials } from "@/app/actions/materials";
import { MarketplaceContent } from "./marketplace-content";
import { getAdminSession, getUserSession } from "@/lib/session";
import { IBM_Plex_Sans } from "next/font/google";
import { $Enums } from "@/generated/prisma/client";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const materials = await getMaterials({
        search: params.search,
        department: params.department,
        level: params.level,
        author: params.author,
        semester: params.semester === "all" ? undefined : params.semester as $Enums.Semester,
        courseCode: params.courseCode,
        category: params.category,
        isFree: params.price === "free" ? true : params.price === "paid" ? false : undefined,
    });

    const adminSession = await getAdminSession();
    const userSession = await getUserSession();

    let purchasedMaterialIds: string[] = [];
    if (userSession) {
        const orders = await import("@/lib/db").then(m => m.default.order.findMany({
            where: {
                userId: userSession.id,
                status: "COMPLETED"
            },
            select: { materialId: true }
        }));
        purchasedMaterialIds = orders.map(o => o.materialId);
    }

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
                            <span>Marketplace</span>
                        </div>
                        <h1 className={`text-4xl md:text-6xl font-bold font-heading tracking-tight leading-tight ${ibm_plex_sans.className}`}>
                            Academic <span className="text-primary">Resources</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Browse and purchase quality academic materials verified by top authors across all departments.
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    }>
                        <MarketplaceContent
                            initialMaterials={materials}
                            adminId={adminSession?.id}
                            userId={userSession?.id}
                            purchasedMaterialIds={purchasedMaterialIds}
                        />
                    </Suspense>
                </div>
            </main>

            <Footer />
        </div>
    );
}
