import { notFound } from "next/navigation";
import { getMaterialById } from "@/app/actions/materials";
import { EditMaterialForm } from "./edit-form";

export default async function EditMaterialPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const material = await getMaterialById(id);

    if (!material) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Material</h1>
                <p className="text-muted-foreground mt-1">
                    Update material information
                </p>
            </div>

            <EditMaterialForm material={material} />
        </div>
    );
}
