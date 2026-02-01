"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DEPARTMENTS, LEVELS, DEPARTMENT_LABELS, LEVEL_LABELS, MATERIAL_CATEGORIES, MATERIAL_CATEGORY_LABELS } from "@/lib/constants";
import { editMaterial } from "@/app/actions/materials";
import { $Enums } from "@/generated/prisma/client";
import { Combobox } from "@/app/marketplace/combo-box";
import { getTutors } from "@/app/actions/peripheral";

type Material = {
    id: string;
    name: string;
    course: string;
    courseCode: string;
    semester: $Enums.Semester;
    department: string | null;
    level: string | null;
    category: string | null;
    price: number;
    coAuthorId: string | null;
    equityPercentage: number | null;
    referralPercentage: number | null;
    isPublished: boolean;
};

export function EditMaterialForm({ material }: { material: Material }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [coAuthor, setCoAuthor] = useState(material.coAuthorId || "");
    const [tutors, setTutors] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchTutors = async () => {
            const result = await getTutors();
            if (result.status) {
                setTutors(result.data as { value: string; label: string }[] ?? []);
            }
        };
        fetchTutors();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const result = await editMaterial({
            id: material.id,
            name: formData.get("name") as string,
            course: formData.get("course") as string,
            courseCode: formData.get("courseCode") as string,
            semester: formData.get("semester") as $Enums.Semester,
            department: formData.get("department") as string,
            level: formData.get("level") as string,
            price: parseFloat(formData.get("price") as string),
            coauthor: coAuthor || null,
            equityPercentage: formData.get("equityPercentage") ? parseFloat(formData.get("equityPercentage") as string) : undefined,
            referralPercentage: formData.get("referralPercentage") ? parseFloat(formData.get("referralPercentage") as string) : undefined,
        });

        if (result.success) {
            toast.success(result.message);
            router.push("/admin/materials");
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Material Details</CardTitle>
                <CardDescription>
                    Update the information about your material
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Material Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={material.name}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="course">Course Title</Label>
                            <Input
                                id="course"
                                name="course"
                                defaultValue={material.course}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="courseCode">Course Code (Short)</Label>
                            <Input
                                id="courseCode"
                                name="courseCode"
                                defaultValue={material.courseCode}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select name="department" defaultValue={material.department || undefined} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {DEPARTMENT_LABELS[d]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Select name="level" defaultValue={material.level || undefined} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEVELS.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {LEVEL_LABELS[l]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Material Category</Label>
                            <Select name="category" defaultValue={material.category || undefined} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MATERIAL_CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {MATERIAL_CATEGORY_LABELS[c]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select name="semester" defaultValue={material.semester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIRST">First Semester</SelectItem>
                                    <SelectItem value="SECOND">Second Semester</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="100"
                            defaultValue={material.price}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="coauthor">Co-author (Optional)</Label>
                        <Combobox
                            items={tutors}
                            value={coAuthor}
                            setValue={setCoAuthor}
                            placeholder="Select co-author"
                            searchPlaceholder="Search co-author..."
                            className="w-full h-10 rounded-md border-input bg-background"
                        />
                        <input type="hidden" name="coauthor" value={coAuthor} />
                    </div>

                    {coAuthor && (
                        <div className="space-y-2">
                            <Label htmlFor="equityPercentage">Co-author Equity Percentage (%)</Label>
                            <Input
                                id="equityPercentage"
                                name="equityPercentage"
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                defaultValue={material.equityPercentage || ""}
                                placeholder="e.g., 20"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="referralPercentage">Referral Commission (%)</Label>
                        <Input
                            id="referralPercentage"
                            name="referralPercentage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            defaultValue={material.referralPercentage || 0}
                            placeholder="e.g., 10"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="px-8"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card >
    );
}
