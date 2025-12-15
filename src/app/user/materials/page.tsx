import { getUserPurchasedMaterials } from "@/app/actions/orders";
import { MaterialsList } from "./materials-list";

export default async function UserMaterialsPage() {
    const materials = await getUserPurchasedMaterials();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Materials</h1>
                <p className="text-muted-foreground mt-1">
                    Download your purchased study materials
                </p>
            </div>

            <MaterialsList materials={materials} />
        </div>
    );
}
