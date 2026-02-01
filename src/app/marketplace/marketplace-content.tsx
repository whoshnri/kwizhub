"use client";

import { useState, useEffect } from "react";
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
import { Combobox } from "./combo-box";
import { $Enums } from "@/generated/prisma/client";
import Link from "next/link";
import { ArrowRight, Search, X, Tag, BookOpen, User, Filter, GraduationCap, School, Calendar } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";
import { getTutors } from "../actions/peripheral";
import { DEPARTMENTS, LEVELS, DEPARTMENT_LABELS, LEVEL_LABELS, MATERIAL_CATEGORIES, MATERIAL_CATEGORY_LABELS } from "@/lib/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ibm_plex_sans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

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
    const materials = initialMaterials;
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
    const [department, setDepartment] = useState(searchParams.get("department") || "");
    const [level, setLevel] = useState(searchParams.get("level") || "");
    const [semester, setSemester] = useState(searchParams.get("semester") || "");
    const [courseCode, setCourseCode] = useState(searchParams.get("courseCode") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");

    const [tutors, setTutors] = useState<{ value: string; label: string }[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    useEffect(() => {
        const fetchTutors = async () => {
            const result = await getTutors();
            if (result.status == true) {
                setTutors(result.data as { value: string; label: string }[] ?? []);
            }
        };
        fetchTutors();
    }, []);

    const isAuthenticated = !!(userId || adminId);
    const isAdmin = !!adminId;

    const departmentItems = DEPARTMENTS.map(d => ({ value: d, label: DEPARTMENT_LABELS[d] }));

    function handleSearch() {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (author) params.set("author", author);
        if (department) params.set("department", department);
        if (level) params.set("level", level);
        if (semester) params.set("semester", semester);
        if (courseCode) params.set("courseCode", courseCode);
        if (category && category !== "all") params.set("category", category);
        if (priceFilter !== "all") params.set("price", priceFilter);
        router.push(`/marketplace?${params.toString()}`);
    }

    function clearFilters() {
        setSearch("");
        setAuthor("");
        setDepartment("");
        setLevel("");
        setSemester("");
        setCourseCode("");
        setCategory("");
        setPriceFilter("all");
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
        <div className="space-y-12">
            {/* Filters */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-8 space-y-2">
                        <Label htmlFor="search" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Search Materials</Label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                id="search"
                                placeholder="Search by name, course..."
                                className="pl-12 h-14 rounded-2xl bg-background/50 border-border/40 focus:border-primary/50 transition-all text-base"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-4 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Author</Label>
                        <Combobox
                            items={tutors}
                            value={author}
                            setValue={setAuthor}
                            placeholder="Select Author"
                            searchPlaceholder="Search Author..."
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="text-primary font-bold uppercase tracking-widest text-xs h-8 px-3 rounded-full hover:bg-primary/5"
                    >
                        <Filter className="mr-2 h-3 w-3" />
                        {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                    </Button>
                </div>

                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Department</Label>
                            <Combobox
                                items={departmentItems}
                                value={department}
                                setValue={setDepartment}
                                placeholder="All Departments"
                                searchPlaceholder="Search Dept..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2 w-full">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Level</Label>
                            <Select value={level} onValueChange={setLevel}>
                                <SelectTrigger className="py-7 rounded-2xl bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {LEVELS.map((l) => (
                                        <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Semester</Label>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger className="py-7 rounded-2xl bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Semesters" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="all">All Semesters</SelectItem>
                                    <SelectItem value="FIRST">1st Semester</SelectItem>
                                    <SelectItem value="SECOND">2nd Semester</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="courseCode" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Course Code</Label>
                            <Input
                                id="courseCode"
                                placeholder="e.g. CSC301"
                                className="h-14 rounded-2xl bg-background/50 border-border/40 focus:border-primary/50 transition-all"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="py-7 rounded-2xl bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {MATERIAL_CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c}>{MATERIAL_CATEGORY_LABELS[c]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Price</Label>
                            <Select
                                value={priceFilter}
                                onValueChange={setPriceFilter}
                            >
                                <SelectTrigger className="py-7 rounded-2xl bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Prices" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="all">All Prices</SelectItem>
                                    <SelectItem value="free">Free Only</SelectItem>
                                    <SelectItem value="paid">Paid Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                        onClick={handleSearch}
                        className="h-12 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all font-medium"
                    >
                        Apply Filters
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-12 px-6 rounded-full text-muted-foreground hover:text-foreground transition-all"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                </div>
            </div>

            {/* Results */}
            {materials.length === 0 ? (
                <div className="py-24 text-center space-y-4 bg-muted/10 rounded-4xl border border-dashed border-border/60">
                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-medium text-foreground/80">No materials found</p>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Try adjusting your filters or search keywords to find what you're looking for.
                    </p>
                    <Button variant="outline" onClick={clearFilters} className="rounded-full mt-4">
                        View All Materials
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {materials.map((material) => {
                        const isOwned = purchasedMaterialIds.includes(material.id);
                        return (
                            <Card key={material.id} className="group flex flex-col bg-card/40 backdrop-blur-md border-border/40 rounded-3xl overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                                <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
                                    <div className="flex items-center justify-between gap-2 mb-2 md:mb-3">
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                                            <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                        </div>
                                        <Badge variant="outline" className="rounded-full px-2 md:px-3 py-0.5 border-primary/20 text-primary bg-primary/5 uppercase text-[9px] md:text-[10px] font-bold truncate">
                                            {material.course}
                                        </Badge>
                                    </div>
                                    <CardTitle className={`text-base md:text-xl font-bold font-heading line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors duration-300 ${ibm_plex_sans.className}`}>
                                        {material.name}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1.5 mt-2 md:mt-3 text-[10px] md:text-xs font-medium text-muted-foreground">
                                        <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center">
                                            <User className="h-2.5 w-2.5" />
                                        </div>
                                        <span className="truncate">By {material.admin.name}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-4 md:px-6 pb-4 md:pb-6 flex-1">
                                    <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-2">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                            <Tag className="h-2 w-2 md:h-2.5 md:w-2.5" />
                                            {material.courseCode}
                                        </div>
                                        {material.department && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                                {DEPARTMENT_LABELS[material.department as keyof typeof DEPARTMENT_LABELS] || material.department}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                            <BookOpen className="h-2 w-2 md:h-2.5 md:w-2.5" />
                                            {material.semester === "FIRST" ? "1st Sem" : "2nd Sem"}
                                        </div>
                                        {material.level && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                                {LEVEL_LABELS[material.level as keyof typeof LEVEL_LABELS] || material.level}
                                            </div>
                                        )}
                                        {material.category && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                                                {MATERIAL_CATEGORY_LABELS[material.category as keyof typeof MATERIAL_CATEGORY_LABELS] || material.category}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 md:p-6 pt-3 md:pt-4 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Price</span>
                                        <span className={`text-base md:text-xl font-bold font-heading text-foreground ${ibm_plex_sans.className}`}>
                                            {material.price === 0 ? "FREE" : `₦${material.price.toLocaleString()}`}
                                        </span>
                                    </div>

                                    {isAuthenticated ? (
                                        isAdmin ? (
                                            <Button
                                                onClick={() => openGenerateDialog(material)}
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full h-8 md:h-10 text-[10px] md:text-xs font-bold uppercase tracking-tight"
                                            >
                                                Generate
                                            </Button>
                                        ) : (
                                            isOwned ? (
                                                <Link href="/user/materials" className="w-full sm:w-auto">
                                                    <Button variant="secondary" size="sm" className="w-full rounded-full h-8 md:h-10 text-[10px] md:text-xs font-bold uppercase tracking-tight">
                                                        Owned
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedMaterial(material);
                                                        setShowPurchaseDialog(true);
                                                    }}
                                                    size="sm"
                                                    className="w-full sm:w-auto rounded-full h-8 md:h-10 bg-black dark:bg-white text-white dark:text-black hover:scale-102 transition-all font-bold text-[10px] md:text-xs uppercase tracking-tight"
                                                >
                                                    Buy Now
                                                </Button>
                                            )
                                        )
                                    ) : (
                                        <Link href="/login" className="w-full sm:w-auto">
                                            <Button size="sm" className="w-full rounded-full h-8 md:h-10 bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] md:text-xs uppercase tracking-tight">
                                                Purchase
                                            </Button>
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
                <DialogContent className="rounded-4xl sm:max-w-[425px] border-border/40 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className={`text-2xl font-bold ${ibm_plex_sans.className}`}>Confirm Purchase</DialogTitle>
                        <DialogDescription className="text-base">
                            Join thousands of students learning smarter.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMaterial && (
                        <div className="space-y-6 py-6">
                            <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg leading-tight">{selectedMaterial.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {selectedMaterial.course} • By {selectedMaterial.admin.name}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-border/40 flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Due</span>
                                    <span className={`text-3xl font-bold text-primary ${ibm_plex_sans.className}`}>
                                        ₦{selectedMaterial.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="referralCode" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Referral Code (Optional)</Label>
                                <Input
                                    id="referralCode"
                                    placeholder="Enter code if any"
                                    className="h-12 rounded-2xl bg-background/50"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                            </div>

                            <p className="text-[11px] text-muted-foreground leading-relaxed text-center px-4">
                                By completing this purchase, you agree to our terms of service.
                                Materials are delivered instantly to your digital library.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowPurchaseDialog(false)} className="rounded-full h-12">
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={purchasing}
                            className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                        >
                            {purchasing ? "Processing..." : "Complete Purchase"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Referral Generation Dialog */}
            <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
                <DialogContent className="rounded-4xl sm:max-w-[425px] border-border/40 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className={`text-2xl font-bold ${ibm_plex_sans.className}`}>Generate Referral</DialogTitle>
                        <DialogDescription className="text-base">
                            Create a code and earn commissions on every sale.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMaterial && (
                        <form onSubmit={handleGenerateReferral} className="space-y-6 py-6">
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                                <p className="text-sm font-semibold">{selectedMaterial.name}</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="newCode" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Unique Code</Label>
                                <Input
                                    id="newCode"
                                    placeholder="e.g. MATH-EXPERT"
                                    className="h-12 rounded-2xl bg-background/50 font-mono"
                                    value={newReferralCode}
                                    onChange={(e) => setNewReferralCode(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="commission" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Commission Rate</Label>
                                <div className="relative">
                                    <Input
                                        id="commission"
                                        type="number"
                                        disabled
                                        value={referralCommission}
                                        className="h-12 rounded-2xl bg-muted pr-12"
                                        readOnly
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground ml-1 italic">
                                    Commission rate set by the author for this material.
                                </p>
                            </div>

                            <DialogFooter className="gap-3 sm:gap-0 pt-4">
                                <Button variant="ghost" type="button" onClick={() => setShowGenerateDialog(false)} className="rounded-full h-12">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={generating}
                                    className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                >
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

