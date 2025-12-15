import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken } from "@/lib/pwa-session";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const sessionData = await validateSessionToken(token);

        if (!sessionData) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const { user } = sessionData;

        // Fetch user's purchased materials
        // Assuming "materials" relation in User model reflects purchased/downloadable content
        // based on existing schema:   materials    Material[] @relation("Downloads")
        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                materials: {
                    select: {
                        id: true,
                        name: true,
                        course: true,
                        courseCode: true,
                        pdfPath: true, // Needed for the reader
                        semester: true,
                    },
                },
            },
        });

        if (!userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(userData.materials);
    } catch (error) {
        console.error("API Books Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
