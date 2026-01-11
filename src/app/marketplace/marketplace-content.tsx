"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createOrder } from "@/app/actions/orders";
import { generateReferralCode } from "@/app/actions/referrals";
import { ComboboxDemo } from "./combo-box";
import { $Enums } from "@/generated/prisma/client";
import Link from "next/link";

type Material = {
    id: string;
    name: string;
    course: string;
    courseCode: string;
    semester: $Enums.Semester;
    price: number;
    coAuthorId: string | null;
    referralPercentage: number | null;
    adminId: string;
    admin: {
        name: string;
        username: string;
    };
};

export function MarketplaceContent({
    initialMaterials,
    adminId,
    userId,
    purchasedMaterialIds = [],
}: {
    initialMaterials: Material[];
    adminId?: string;
    userId?: string;
    purchasedMaterialIds?: string[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [materials] = useState(initialMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
    const [showGenerateDialog, setShowGenerateDialog] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [referralCode, setReferralCode] = useState("");

    // Referral Generation State
    const [newReferralCode, setNewReferralCode] = useState("");
    const [referralCommission, setReferralCommission] = useState<number | "">("");

    // Filter states
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [author, setAuthor] = useState(searchParams.get("author") || "");

    const isAuthenticated = !!(userId || adminId);
    const isAdmin = !!adminId;

    function handleSearch() {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (author) params.set("author", author);
        router.push(`/marketplace?${params.toString()}`);
    }

    function clearFilters() {
        setSearch("");
        setAuthor("");
        router.push("/marketplace");
    }

    async function handlePurchase() {
        if (!selectedMaterial) return;
        setPurchasing(true);

        const result = await createOrder({
            materialId: selectedMaterial.id,
            referralCode: referralCode || undefined
        });

        if (result.success) {
            toast.success(result.message);
            setShowPurchaseDialog(false);
            setReferralCode("");
            router.push("/user/materials");
        } else {
            toast.error(result.message);
        }

        setPurchasing(false);
    }

    async function handleGenerateReferral(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedMaterial) return;
        setGenerating(true);

        const formData = new FormData();
        formData.append("materialId", selectedMaterial.id);
        formData.append("code", newReferralCode);
        if (referralCommission) {
            formData.append("percentage", referralCommission.toString());
        }

        const result = await generateReferralCode(formData);

        if (result.success) {
            toast.success(result.message);
            setShowGenerateDialog(false);
            setNewReferralCode("");
            setReferralCommission("");
        } else {
            toast.error(result.message);
        }
        setGenerating(false);
    }

    function openGenerateDialog(material: Material) {
        setSelectedMaterial(material);
        setReferralCommission(material.referralPercentage || "");
        setShowGenerateDialog(true);
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-4">
                            <Label htmlFor="search" className="sr-only">Search</Label>
                            <Input
                                id="search"
                                placeholder="Search by name or course..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <ComboboxDemo value={author} setValue={setAuthor} />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleSearch}>Search</Button>
                        <Button variant="outline" onClick={clearFilters}>Clear</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {materials.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No materials found. Try adjusting your filters.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => {
                        const isOwned = purchasedMaterialIds.includes(material.id);
                        return (
                            <Card key={material.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg font-heading line-clamp-2">{material.name}</CardTitle>
                                        <Badge variant="secondary" className="shrink-0">
                                            {material.course}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                        <span>By {material.admin.name}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="pt-1">
                                            {material.semester}
                                        </Badge>
                                        <Badge variant="outline" className="pt-1">
                                            {material.courseCode}
                                        </Badge>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex items-center justify-between pt-0">
                                    <span className="text-2xl font-bold font-heading text-primary">
                                        ₦{material.price.toLocaleString()}
                                    </span>

                                    {isAuthenticated ? (
                                        isAdmin ? (
                                            <Button onClick={() => openGenerateDialog(material)} variant="outline">
                                                Generate Referral
                                            </Button>
                                        ) : (
                                            isOwned ? (
                                                <Link href="/user/materials">
                                                    <Button variant="secondary">Owned</Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedMaterial(material);
                                                        setShowPurchaseDialog(true);
                                                    }}
                                                >
                                                    Buy Now
                                                </Button>
                                            )
                                        )
                                    ) : (
                                        <Link href="/login">
                                            <Button>Login to Purchase</Button>
                                        </Link>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Purchase Dialog */}
            <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>
                            You are about to purchase this material
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMaterial && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold">{selectedMaterial.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Course: {selectedMaterial.course}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Author: {selectedMaterial.admin.name}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                                <Input
                                    id="referralCode"
                                    placeholder="Enter code"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ₦{selectedMaterial.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                By completing this purchase, you agree to our terms of service.
                                The material will be available for use immediately after payment.
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePurchase} disabled={purchasing}>
                            {purchasing ? "Processing..." : "Complete Purchase"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Referral Generation Dialog */}
            <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Referral Code</DialogTitle>
                        <DialogDescription>
                            Create a unique code to refer users to this material and earn commissions.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMaterial && (
                        <form onSubmit={handleGenerateReferral} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">{selectedMaterial.name}</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newCode">Referral Code</Label>
                                <Input
                                    id="newCode"
                                    placeholder="e.g. SUMMER2024"
                                    value={newReferralCode}
                                    onChange={(e) => setNewReferralCode(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Alphanumeric and dashes only.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="commission">Commission (%)</Label>
                                <Input
                                    id="commission"
                                    type="number"
                                    min="1"
                                    max="100"
                                    disabled
                                    value={referralCommission}
                                    placeholder={selectedMaterial.referralPercentage?.toString() || "0"}
                                    readOnly
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Commission rate set by the author.
                                </p>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setShowGenerateDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={generating}>
                                    {generating ? "Generating..." : "Generate Code"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

