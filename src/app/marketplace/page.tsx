import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getMaterials } from "@/app/actions/materials";
import { MarketplaceContent } from "./marketplace-content";
import { getAdminSession, getUserSession } from "@/lib/session";

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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
                        <p className="text-muted-foreground">
                            Browse and purchase quality academic materials
                        </p>
                    </div>

                    <Suspense fallback={<div>Loading...</div>}>
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
