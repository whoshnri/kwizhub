"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DEPARTMENTS, LEVELS, DEPARTMENT_LABELS, LEVEL_LABELS, MATERIAL_CATEGORY_LABELS, MATERIAL_CATEGORIES } from "@/lib/constants";
import { uploadMaterial } from "@/app/actions/materials";
import { DropzoneContent, DropzoneEmptyState, Dropzone } from "@/components/ui/shadcn-io/dropzone";
import { Combobox } from "@/app/marketplace/combo-box";
import { getTutors } from "@/app/actions/peripheral";

export default function NewMaterialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [coAuthor, setCoAuthor] = useState("");
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

    const handleDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a PDF file");
            return;
        }

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("file", file);
        formData.set("coauthor", coAuthor);

        const result = await uploadMaterial(formData);

        if (result.success) {
            toast.success(result.message);
            router.push("/admin/materials");
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    }

    return (
        <div className="space-y-6 justify-center flex pb-20">
            <div className="w-full max-w-2xl px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading">Upload Material</h1>
                    <p className="text-muted-foreground mt-1">
                        Add a new study material to sell
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Material Details</CardTitle>
                        <CardDescription>
                            Fill in the information about your material
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Material Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g., Introduction to Computer Science"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="course">Course Title</Label>
                                    <Input
                                        id="course"
                                        name="course"
                                        placeholder="e.g., Intro to Programming"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseCode">Course Code</Label>
                                    <Input
                                        id="courseCode"
                                        name="courseCode"
                                        placeholder="e.g., CSC101"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select name="department" required>
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
                                    <Select name="level" required>
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
                                    <Select name="category" required>
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

                                <div className="space-y-2 ">
                                    <Label htmlFor="semester">Semester</Label>
                                    <Select name="semester" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select semester" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
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
                                    placeholder="e.g., 2500"
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
                                        placeholder="e.g., 20"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">The percentage of earnings the co-author will receive.</p>
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
                                    defaultValue={0}
                                    placeholder="e.g., 10"
                                />
                                <p className="text-xs text-muted-foreground">Percentage of sales given to referrers.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">PDF File</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                    {file ? (
                                        <div className="space-y-2">
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFile(null)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Dropzone
                                            accept={{ "application/pdf": [] }}
                                            maxFiles={1}
                                            maxSize={1024 * 1024 * 10}
                                            minSize={1024}
                                            onDrop={handleDrop}
                                            onError={console.error}
                                        >
                                            <DropzoneEmptyState />
                                            <DropzoneContent />
                                        </Dropzone>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={loading || !file} className="flex-1">
                                    {loading ? "Uploading..." : "Upload Material"}
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
                </Card>
            </div>
        </div>
    );
}
