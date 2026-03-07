"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { initializePurchaseTransaction } from "@/app/actions/paystack-purchases";
import { generateReferralCode } from "@/app/actions/referrals";
import Script from "next/script";
import { Combobox } from "./combo-box";
import { $Enums } from "@/generated/prisma/client";
import Link from "next/link";
import { ArrowRight, Search, X, Tag, BookOpen, User, Filter, GraduationCap, School, Calendar, Loader2, Info, CheckCircle2 } from "lucide-react";
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
    userEmail,
    purchasedMaterialIds = [],
}: {
    initialMaterials: Material[];
    adminId?: string;
    userId?: string;
    userEmail?: string;
    purchasedMaterialIds?: string[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const materials = initialMaterials;
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
    const [purchaseStep, setPurchaseStep] = useState<"INPUT" | "PROCESSING" | "SUCCESS">("INPUT");
    const [purchasing, setPurchasing] = useState(false);
    const [referralCode, setReferralCode] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // User Email for Paystack (fallback if not provided in props)
    const email = userEmail || "customer@kwizhub.com";

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

        const initRes = await initializePurchaseTransaction(selectedMaterial.id, email, referralCode);

        if (!initRes.success || !initRes.data) {
            toast.error(initRes.message || "Failed to initialize payment.");
            setPurchasing(false);
            return;
        }

        const { access_code, reference } = initRes.data;

        // Dynamically import Paystack to avoid SSR "window is not defined" error
        const PaystackModule = await import('@paystack/inline-js');
        const Paystack = PaystackModule.default || PaystackModule;
        const paystack = new Paystack();

        paystack.resumeTransaction(
            access_code,
            {
                onSuccess: () => {
                    setPurchaseStep("PROCESSING");
                    const toastId = toast.loading("Confirming transaction...");

                    // Listen for webhook confirmation via SSE
                    const eventSource = new EventSource(`/api/payment-status/${reference}`);

                    eventSource.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);

                            if (data.type === "connected") return;

                            if (data.type === "payment_status") {
                                toast.dismiss(toastId);
                                eventSource.close();

                                if (data.success) {
                                    toast.success(data.message || "Purchase confirmed!");
                                    setPurchaseStep("SUCCESS");
                                    setReferralCode("");
                                } else {
                                    toast.error(data.message || "Payment verification failed");
                                    setPurchaseStep("INPUT");
                                }
                                setPurchasing(false);
                                router.refresh();
                            }

                            if (data.type === "timeout") {
                                toast.dismiss(toastId);
                                eventSource.close();
                                toast.info(data.message || "Payment is being processed. Check your dashboard.");
                                setPurchasing(false);
                            }
                        } catch {
                            // Ignore parse errors
                        }
                    };

                    eventSource.onerror = () => {
                        toast.dismiss(toastId);
                        eventSource.close();
                        toast.info("Payment is being processed. Check your dashboard shortly.");
                        setPurchasing(false);
                    };
                },
                onCancel: () => {
                    setPurchasing(false);
                    toast.error("Payment cancelled");
                }
            }
        );
    }



    return (
        <div className="space-y-5">
            <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
            {/* Filters */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-8 space-y-2">
                        <Label htmlFor="search" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Search Materials</Label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                id="search"
                                placeholder="Search by name, course..."
                                className="pl-12 h-14 rounded-lg bg-background/50 border-border/40 focus:border-primary/50 transition-all text-base"
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
                            className="w-full rounded-lg"
                        />
                    </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="text-primary font-bold uppercase tracking-widest text-xs py-5 px-3 rounded-lg hover:bg-primary/5"
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
                                <SelectTrigger className="py-7 rounded-lg bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-border/40 bg-card/95 backdrop-blur-xl">
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
                                <SelectTrigger className="py-7 rounded-lg bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Semesters" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-border/40 bg-card/95 backdrop-blur-xl">
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
                                className="h-14 rounded-lg bg-background/50 border-border/40 focus:border-primary/50 transition-all"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="py-7 rounded-lg bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-border/40 bg-card/95 backdrop-blur-xl">
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
                                <SelectTrigger className="py-7 rounded-lg bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/50">
                                    <SelectValue placeholder="All Prices" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-border/40 bg-card/95 backdrop-blur-xl">
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
                        className="h-12 px-8 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all font-medium"
                    >
                        Apply Filters
                    </Button>
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="h-12 px-6 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                </div>
            </div>


            <div className="text-lg font-bold font-heading text-foreground">Found {materials.length} material{materials.length === 1 ? "" : "s"}</div>
            {/* Results */}
            {materials.length === 0 ? (
                <div className="py-24 text-center space-y-4 bg-muted/10 rounded-lg border border-dashed border-border/60">
                    <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-medium text-foreground/80">No materials found</p>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Try adjusting your filters or search keywords to find what you&apos;re looking for.
                    </p>
                    <Button variant="outline" onClick={clearFilters} className="rounded-lg mt-4">
                        View All Materials
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {materials.map((material) => {
                        const isOwned = purchasedMaterialIds.includes(material.id);
                        return (
                            <Card key={material.id} className="group flex flex-col bg-card/40 backdrop-blur-md border-border/40 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/20 gap-0 px-3">
                                <CardHeader className="p-4 pb-2">

                                    <CardTitle className={`text-3xl font-bold font-heading line-clamp-2 leading-tight text-foreground group-hover:text-primary transition-colors duration-300 ${ibm_plex_sans.className}`}>
                                        {material.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-sm font-medium text-muted-foreground truncate">
                                        By {material.admin.name}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-4 pb-4 flex-1">
                                    <div className="grid grid-cols-2 gap-1 mt-1">
                                        <div className="px-2 py-2 rounded-lg bg-muted/40 text-sm font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                            {material.courseCode}
                                        </div>
                                        {material.department && (
                                            <div className="px-2 py-2 rounded-lg bg-muted/40 text-sm font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                                {DEPARTMENT_LABELS[material.department as keyof typeof DEPARTMENT_LABELS] || material.department}
                                            </div>
                                        )}
                                        <div className="px-2 py-2 rounded-lg bg-muted/40 text-sm font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                            {material.semester === "FIRST" ? "1st Sem" : "2nd Sem"}
                                        </div>
                                        {material.level && (
                                            <div className="px-2 py-2 rounded-lg bg-muted/40 text-sm font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                                {LEVEL_LABELS[material.level as keyof typeof LEVEL_LABELS] || material.level}
                                            </div>
                                        )}
                                        {material.course && (
                                            <div className="px-2 py-2 rounded-lg bg-muted/40 text-sm font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                                                {material.course.replaceAll("_", " ")}
                                            </div>
                                        )}
                                        {material.category && (
                                            <div className="px-2 py-2 rounded-lg bg-primary/10 text-sm font-bold uppercase tracking-wider text-primary border border-primary/20">
                                                {MATERIAL_CATEGORY_LABELS[material.category as keyof typeof MATERIAL_CATEGORY_LABELS] || material.category}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-3 border-t border-border/40 bg-muted/10 flex items-center justify-between gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold uppercase text-muted-foreground mb-0.5">Price</span>
                                        <span className={`text-2xl font-bold font-heading text-foreground ${ibm_plex_sans.className}`}>
                                            {material.price === 0 ? "FREE" : `₦${material.price.toLocaleString()}`}
                                        </span>
                                    </div>

                                    {isAuthenticated ? (
                                        isAdmin ? null : ( // Hide generator button for admins to simplify
                                            isOwned ? (
                                                <Link href="/user/materials" className="w-auto">
                                                    <Button variant="secondary" size="sm" className="rounded-lg py-5 cursor-pointer text-sm font-bold uppercase tracking-tight">
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
                                                    className="rounded-lg py-6 bg-black dark:bg-white text-white dark:text-black cursor-pointer transition-all font-bold text-xs uppercase tracking-tight"
                                                >
                                                    Buy Now
                                                </Button>
                                            )
                                        )
                                    ) : (
                                        <Link href="/login" className="w-auto">
                                            <Button size="sm" className="rounded-lg py-6 bg-black dark:bg-white text-white dark:text-black cursor-pointer font-bold text-xs uppercase tracking-tight">
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

            <Sheet open={showPurchaseDialog} onOpenChange={(open) => {
                setShowPurchaseDialog(open);
                if (!open && purchaseStep === "SUCCESS") {
                    setPurchaseStep("INPUT");
                    router.push("/user/materials");
                }
            }}>
                <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:max-w-lg overflow-y-auto px-4 py-6 max-h-[90vh] sm:max-h-full rounded-t-2xl sm:rounded-none">
                    <SheetHeader>
                        <SheetTitle>
                            {purchaseStep === "INPUT" && "Confirm Purchase"}
                            {purchaseStep === "PROCESSING" && "Processing Transfer"}
                            {purchaseStep === "SUCCESS" && "Purchase Complete"}
                        </SheetTitle>
                        {purchaseStep === "INPUT" && (
                            <SheetDescription>
                                Join the community of students learning smarter.
                            </SheetDescription>
                        )}
                    </SheetHeader>

                    {selectedMaterial && purchaseStep === "INPUT" && (
                        <div className="space-y-6 py-4 mt-4">
                            <div className="rounded-lg border p-4 space-y-3 bg-card shadow-sm">
                                <h3 className="font-semibold text-lg border-b pb-2">Material Details</h3>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-muted-foreground">Material:</span>
                                    <span className="font-bold text-right text-primary">{selectedMaterial.name}</span>

                                    <span className="text-muted-foreground">Course:</span>
                                    <span className="font-medium text-right">{selectedMaterial.course}</span>

                                    <span className="text-muted-foreground">Author:</span>
                                    <span className="font-medium text-right">{selectedMaterial.admin.name}</span>

                                    <span className="text-muted-foreground mt-2 font-semibold">Amount Due:</span>
                                    <span className="font-bold text-right font-mono mt-2 text-primary">₦{selectedMaterial.price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                                <Input
                                    id="referralCode"
                                    placeholder="Enter code if any"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-4">
                                <Button variant="outline" className="w-full py-6" onClick={() => setShowPurchaseDialog(false)}>
                                    Cancel
                                </Button>
                                <Button className="w-full py-6" onClick={handlePurchase} disabled={purchasing}>
                                    {purchasing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>Initiate Checkout</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {purchaseStep === "PROCESSING" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center mt-8">
                            <Info className="h-16 w-16 text-blue-500 mb-2 animate-pulse" />
                            <h3 className="text-2xl font-bold">Transfer Processing</h3>
                            <p className="text-muted-foreground mb-6">
                                Please complete the payment in the Paystack window. We are waiting for the successful response.
                            </p>
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {purchaseStep === "SUCCESS" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center mt-8">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                            <h3 className="text-2xl font-bold">Purchase Successful!</h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Your material has been added to your library.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowPurchaseDialog(false);
                                    setPurchaseStep("INPUT");
                                    router.push("/user/materials");
                                }}
                            >
                                Done
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

        </div>
    );
}
