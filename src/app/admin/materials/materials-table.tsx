"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DEPARTMENT_LABELS, LEVEL_LABELS, MATERIAL_CATEGORY_LABELS, MaterialCategory } from "@/lib/constants";
import { deleteMaterial, toggleMaterialPublish } from "@/app/actions/materials";
import { $Enums } from "@/generated/prisma/client";

type Material = {
    id: string;
    name: string;
    course: string;
    semester: $Enums.Semester;
    department: string | null;
    level: string | null;
    category: string | null;
    price: number;
    coAuthorId: string | null;
    isPublished: boolean;
    createdAt: Date;
    _count: {
        orders: number;
    };
};

export function MaterialsTable({ materials }: { materials: Material[] }) {
    const router = useRouter();
    const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleTogglePublish(id: string) {
        const result = await toggleMaterialPublish(id);
        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    }

    async function handleDelete(id: string) {
        setLoading(true);
        const result = await deleteMaterial(id);
        if (result.success) {
            toast.success(result.message);
            setDeleteDialog(null);
            router.refresh();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    }

    if (materials.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No materials uploaded yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>All Materials</CardTitle>
                    <CardDescription>
                        {materials.length} material{materials.length !== 1 ? "s" : ""} uploaded
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Sales</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.map((material) => (
                                <TableRow key={material.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{material.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{material.course}</TableCell>
                                    <TableCell>
                                        {material.semester}
                                    </TableCell>
                                    <TableCell>
                                        {material.courseCode}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {material.category ? MATERIAL_CATEGORY_LABELS[material.category as MaterialCategory] : "N/A"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{material._count.orders}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ₦{material.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={material.isPublished ? "default" : "secondary"}>
                                            {material.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    •••
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/admin/materials/${material.id}/edit`)}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePublish(material.id)}>
                                                    {material.isPublished ? "Unpublish" : "Publish"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => setDeleteDialog(material.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Material</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this material? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteDialog && handleDelete(deleteDialog)}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
