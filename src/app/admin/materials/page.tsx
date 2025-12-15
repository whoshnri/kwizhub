import Link from "next/link";
import { getAdminMaterials } from "@/app/actions/withdrawals";
import { MaterialsTable } from "./materials-table";
import { Button } from "@/components/ui/button";

export default async function AdminMaterialsPage() {
    const materials = await getAdminMaterials();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Materials</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your uploaded materials
                    </p>
                </div>
                <Link href="/admin/materials/new">
                    <Button>Upload Material</Button>
                </Link>
            </div>

            <MaterialsTable materials={materials} />
        </div>
    );
}
