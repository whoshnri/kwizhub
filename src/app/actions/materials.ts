"use server";

import prisma from "@/lib/db";
import { getAdminSession, getUserSession } from "@/lib/session";

import {
    uploadMaterialSchema,
    editMaterialSchema,
    UploadMaterialInput,
    EditMaterialInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ActionResult } from "./auth";
import { $Enums, Prisma } from "@/generated/prisma/client";
import { uploadToBunnyCDN, deleteFromBunnyCDN } from "@/lib/bunny-cdn";

const logUpload = (traceId: string, message: string, info: Record<string, unknown> = {}) => {
    console.info(`[material-upload ${traceId}] ${message}`, info);
};

// Rate limiting for uploads
const uploadAttempts = new Map<string, { count: number; lastAttempt: number }>();

function checkUploadRateLimit(adminId: string): boolean {
    const now = Date.now();
    const attempts = uploadAttempts.get(adminId);

    if (!attempts) {
        uploadAttempts.set(adminId, { count: 1, lastAttempt: now });
        return true;
    }

    // Reset after 1 hour
    if (now - attempts.lastAttempt > 60 * 60 * 1000) {
        uploadAttempts.set(adminId, { count: 1, lastAttempt: now });
        return true;
    }

    if (attempts.count >= 20) {
        return false;
    }

    uploadAttempts.set(adminId, { count: attempts.count + 1, lastAttempt: now });
    return true;
}

// function removed because it was unused
// File scanning placeholder
async function scanFile(buffer: Buffer): Promise<boolean> {
    // Placeholder for file scanning implementation
    // In production, integrate with ClamAV or similar
    console.log("File scan placeholder - buffer size:", buffer.length);
    return true;
}

export async function uploadMaterial(
    formData: FormData
): Promise<ActionResult<{ id: string }>> {
    const traceId = uuidv4();
    try {
        logUpload(traceId, "🚀 Starting upload", { startedAt: Date.now() });
        const session = await getAdminSession();
        if (!session) {
            logUpload(traceId, "🔒 Auth check failed");
            return { success: false, message: "Not authenticated" };
        }

        if (!checkUploadRateLimit(session.id)) {
            logUpload(traceId, "⏳ Upload rate limit hit", { adminId: session.id });
            return { success: false, message: "Upload limit reached. Please try again later." };
        }

        const file = formData.get("file") as File | null;
        logUpload(traceId, "📥 Form received", { hasFile: Boolean(file) });
        if (!file) {
            return { success: false, message: "No file provided" };
        }

        // Validate PDF
        if (file.type !== "application/pdf") {
            logUpload(traceId, "🛑 File type not allowed", { type: file.type });
            return { success: false, message: "Only PDF files are allowed" };
        }

        // Check size (10MB limit)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            logUpload(traceId, "🛑 File too large", { size: file.size });
            return { success: false, message: "File size must be less than 10MB" };
        }

        const data: UploadMaterialInput = {
            name: formData.get("name") as string,
            course: formData.get("course") as string,
            price: parseFloat(formData.get("price") as string),
            courseCode: formData.get("courseCode") as string,
            semester: formData.get("semester") as $Enums.Semester,
            department: formData.get("department") as string,
            level: formData.get("level") as string,
            category: formData.get("category") as string,
            coauthor: (formData.get("coauthor") as string) || undefined,
            equityPercentage: formData.get("equityPercentage") ? parseFloat(formData.get("equityPercentage") as string) : undefined,
            referralPercentage: formData.get("referralPercentage") ? parseFloat(formData.get("referralPercentage") as string) : undefined,
        };

        logUpload(traceId, "🧾 Parsed form data", data);
        const validated = uploadMaterialSchema.parse(data);
        logUpload(traceId, "✅ Schema validation passed");

        // Read file and scan
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        logUpload(traceId, "📦 File buffered", { size: buffer.length });

        const isSafe = await scanFile(buffer);
        logUpload(traceId, "🧪 Security scan complete", { isSafe });
        if (!isSafe) {
            return { success: false, message: "File failed security scan" };
        }

        // Generate unique filename
        const filename = `${uuidv4()}.pdf`;
        logUpload(traceId, "🧾 Generated filename", { filename });

        // Upload to Bunny CDN (required)
        let bunnyCdnUrl: string | null = null;
        try {
            logUpload(traceId, "🚚 Uploading to Bunny CDN...");
            bunnyCdnUrl = await uploadToBunnyCDN(buffer, filename, "materials/");
            logUpload(traceId, "✅ Bunny upload succeeded", { bunnyCdnUrl });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logUpload(traceId, "❌ Bunny upload failed", { error: errorMessage });
            console.error("Bunny CDN upload error:", error);
            return { success: false, message: "Upload failed while sending to storage. Please retry." };
        }

        if (!bunnyCdnUrl) {
            logUpload(traceId, "❌ Bunny upload missing URL");
            return { success: false, message: "Upload failed while finalizing storage URL." };
        }

        // Verify co-author if exists
        if (validated.coauthor) {
            logUpload(traceId, "🧑‍🤝‍🧑 Checking co-author", { coauthor: validated.coauthor });
            const coauthorExists = await prisma.admin.findUnique({ where: { id: validated.coauthor } });
            if (!coauthorExists) {
                logUpload(traceId, "🚫 Co-author not found", { coauthor: validated.coauthor });
                return { success: false, message: "Selected co-author does not exist." };
            }
        }
        logUpload(traceId, "🗄️ Saving material record");
        const material = await prisma.material.create({
            data: {
                name: validated.name,
                course: validated.course,
                courseCode: validated.courseCode,
                semester: validated.semester,
                department: validated.department,
                level: validated.level,
                category: validated.category,
                price: validated.price,
                coAuthorId: validated.coauthor, // Map coauthor ID
                equityPercentage: validated.equityPercentage,
                referralPercentage: validated.referralPercentage || 0,
                pdfPath: `/materials/${filename}`,
                bunnyCdnUrl: bunnyCdnUrl,
                adminId: session.id,
                coAuthorAccepted: validated.coauthor ? null : undefined, // Explicit null if coauthor
            },
        });

        logUpload(traceId, "🎉 Material saved", { materialId: material.id });

        revalidatePath("/admin/materials");
        revalidatePath("/marketplace");

        logUpload(traceId, "🔄 Cache revalidated");

        return {
            success: true,
            message: "Material uploaded successfully",
            data: { id: material.id },
        };
    } catch (error) {
        logUpload(traceId, "🔥 Unexpected error", { message: error instanceof Error ? error.message : String(error) });
        console.error("Upload material error:", error);
        return { success: false, message: "Upload failed. Please try again." };
    }
}

export async function editMaterial(input: EditMaterialInput): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const validated = editMaterialSchema.parse(input);

        const material = await prisma.material.findUnique({
            where: { id: validated.id },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        if (material.adminId !== session.id) {
            return { success: false, message: "Not authorized" };
        }

        const { id, coauthor, ...updateData } = validated;

        // Verify co-author if exists and changed
        if (coauthor) {
            const coauthorExists = await prisma.admin.findUnique({ where: { id: coauthor } });
            if (!coauthorExists) {
                return { success: false, message: "Selected co-author does not exist." };
            }
        }

        await prisma.material.update({
            where: { id },
            data: {
                ...updateData,
                coAuthorId: coauthor, // Map to relation
            },
        });

        revalidatePath("/admin/materials");
        revalidatePath("/marketplace");

        return { success: true, message: "Material updated successfully" };
    } catch (error) {
        console.error("Edit material error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function deleteMaterial(id: string): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const material = await prisma.material.findUnique({
            where: { id },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        if (material.adminId !== session.id) {
            return { success: false, message: "Not authorized" };
        }

        // Delete file from Bunny CDN or filesystem
        try {
            if (material.bunnyCdnUrl) {
                // Extract path from CDN URL (e.g., "materials/filename.pdf")
                const urlPath = material.bunnyCdnUrl.split(".b-cdn.net/")[1];
                if (urlPath) {
                    await deleteFromBunnyCDN(urlPath);
                }
            } else {
                // Fallback to local file deletion
                const filePath = path.join(process.cwd(), "public", material.pdfPath);
                await unlink(filePath);
            }
        } catch (error) {
            console.log("File deletion error:", error);
        }

        await prisma.material.delete({
            where: { id },
        });

        revalidatePath("/admin/materials");
        revalidatePath("/marketplace");

        return { success: true, message: "Material deleted successfully" };
    } catch (error) {
        console.error("Delete material error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function toggleMaterialPublish(id: string): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const material = await prisma.material.findUnique({
            where: { id },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        if (material.adminId !== session.id) {
            return { success: false, message: "Not authorized" };
        }

        await prisma.material.update({
            where: { id },
            data: { isPublished: !material.isPublished },
        });

        revalidatePath("/admin/materials");
        revalidatePath("/marketplace");

        return {
            success: true,
            message: material.isPublished ? "Material unpublished" : "Material published",
        };
    } catch (error) {
        console.error("Toggle publish error:", error);
        return { success: false, message: "Something went wrong" };
    }
}



export async function getMaterials(filters?: {
    search?: string;
    department?: string;
    level?: string;
    category?: string;
    author?: string;
    semester?: $Enums.Semester;
    courseCode?: string;
    isFree?: boolean;
    materialId?: string;
}) {
    const andConditions: Prisma.MaterialWhereInput[] = [{ isPublished: true }];

    if (filters?.search) {
        andConditions.push({
            OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { course: { contains: filters.search, mode: "insensitive" } },
                { courseCode: { contains: filters.search, mode: "insensitive" } },
            ]
        });
    }

    if (filters?.department) {
        andConditions.push({ department: filters.department });
    }

    if (filters?.level) {
        andConditions.push({ level: filters.level });
    }

    if (filters?.category) {
        andConditions.push({ category: filters.category });
    }

    if (filters?.isFree !== undefined) {
        if (filters.isFree) {
            andConditions.push({ price: 0 });
        } else {
            andConditions.push({ price: { gt: 0 } });
        }
    }

    if (filters?.semester) {
        andConditions.push({ semester: filters.semester });
    }

    if (filters?.courseCode) {
        andConditions.push({ courseCode: { contains: filters.courseCode, mode: "insensitive" } });
    }

    if (filters?.author) {
        andConditions.push({
            OR: [
                { admin: { name: { contains: filters.author, mode: "insensitive" } } },
                { admin: { username: { contains: filters.author, mode: "insensitive" } } },
                { coAuthor: { name: { contains: filters.author, mode: "insensitive" } } },
                { coAuthor: { username: { contains: filters.author, mode: "insensitive" } } },
            ]
        });
    }

    if (filters?.materialId) {
        andConditions.push({ id: filters.materialId });
    }

    return prisma.material.findMany({
        where: { AND: andConditions },
        include: {
            admin: {
                select: { name: true, username: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getMaterialById(id: string) {
    return prisma.material.findUnique({
        where: { id },
        include: {
            admin: {
                select: { name: true, username: true },
            },
        },
    });
}

export async function respondToCoAuthorRequest(
    materialId: string,
    accepted: boolean
): Promise<ActionResult> {
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const material = await prisma.material.findUnique({
            where: { id: materialId },
        });

        if (!material) {
            return { success: false, message: "Material not found" };
        }

        if (material.coAuthorId !== session.id) {
            return { success: false, message: "Not authorized" };
        }

        await prisma.material.update({
            where: { id: material.id },
            data: { coAuthorAccepted: accepted },
        });

        revalidatePath("/admin/materials");
        revalidatePath("/admin");

        return {
            success: true,
            message: accepted ? "Co-authorship accepted" : "Co-authorship declined",
        };
    } catch (error) {
        console.error("Co-author response error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function getPendingCoAuthorRequests() {
    const session = await getAdminSession();
    if (!session) return [];

    return prisma.material.findMany({
        where: {
            coAuthorId: session.id,
            coAuthorAccepted: null,
        },
        include: {
            admin: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });
}
