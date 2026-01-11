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
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ActionResult } from "./auth";
import { $Enums } from "@/generated/prisma/client";
import { uploadToBunnyCDN, deleteFromBunnyCDN } from "@/lib/bunny-cdn";

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

function generateReferralLink(): string {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `REF-KH-${num}`;
}

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
    try {
        const session = await getAdminSession();
        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        if (!checkUploadRateLimit(session.id)) {
            return { success: false, message: "Upload limit reached. Please try again later." };
        }

        const file = formData.get("file") as File | null;
        if (!file) {
            return { success: false, message: "No file provided" };
        }

        // Validate PDF
        if (file.type !== "application/pdf") {
            return { success: false, message: "Only PDF files are allowed" };
        }

        // Check size (10MB limit)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return { success: false, message: "File size must be less than 10MB" };
        }

        const data: UploadMaterialInput = {
            name: formData.get("name") as string,
            course: formData.get("course") as string,
            price: parseFloat(formData.get("price") as string),
            courseCode: formData.get("courseCode") as string,
            semester: formData.get("semester") as $Enums.Semester,
            coauthor: (formData.get("coauthor") as string) || undefined,
            equityPercentage: formData.get("equityPercentage") ? parseFloat(formData.get("equityPercentage") as string) : undefined,
            referralPercentage: formData.get("referralPercentage") ? parseFloat(formData.get("referralPercentage") as string) : undefined,
        };

        const validated = uploadMaterialSchema.parse(data);

        // Read file and scan
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isSafe = await scanFile(buffer);
        if (!isSafe) {
            return { success: false, message: "File failed security scan" };
        }

        // Generate unique filename
        const filename = `${uuidv4()}.pdf`;
        
        // Upload to Bunny CDN
        let bunnyCdnUrl: string | null = null;
        try {
            bunnyCdnUrl = await uploadToBunnyCDN(buffer, filename, "materials/");
        } catch (error) {
            console.error("Bunny CDN upload error:", error);
            // Fallback to local storage if Bunny CDN fails
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);
        }

        // Verify co-author if exists
        if (validated.coauthor) {
            const coauthorExists = await prisma.admin.findUnique({ where: { id: validated.coauthor } });
            if (!coauthorExists) {
                return { success: false, message: "Selected co-author does not exist." };
            }
        }

        const material = await prisma.material.create({
            data: {
                name: validated.name,
                course: validated.course,
                courseCode: validated.courseCode,
                semester: validated.semester,
                price: validated.price,
                coAuthorId: validated.coauthor, // Map coauthor ID
                equityPercentage: validated.equityPercentage,
                referralPercentage: validated.referralPercentage || 0,
                pdfPath: bunnyCdnUrl ? `/materials/${filename}` : `/uploads/${filename}`,
                bunnyCdnUrl: bunnyCdnUrl,
                adminId: session.id,
                coAuthorAccepted: validated.coauthor ? null : undefined, // Explicit null if coauthor
            },
        });

        revalidatePath("/admin/materials");
        revalidatePath("/marketplace");

        return {
            success: true,
            message: "Material uploaded successfully",
            data: { id: material.id },
        };
    } catch (error) {
        console.error("Upload material error:", error);
        return { success: false, message: "Something went wrong" };
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
    author?: string;
}) {
    const where: Record<string, unknown> = { isPublished: true };

    if (filters?.search) {
        where.OR = [
            { name: { contains: filters.search } },
            { course: { contains: filters.search } },
        ];
    }

    if (filters?.department) {
        where.department = filters.department;
    }

    if (filters?.level) {
        where.level = filters.level;
    }

    if (filters?.author) {
        where.admin = {
            OR: [
                { name: { contains: filters.author } },
                { username: { contains: filters.author } },
            ],
        };
    }

    return prisma.material.findMany({
        where,
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
