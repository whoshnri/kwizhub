import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createSessionRecord } from "@/lib/pwa-session";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                _count: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create session (this enforces single device policy)
        // We pass a generic user agent string since we might not have the exact client details
        const { sessionToken } = await createSessionRecord(user.id, req.headers.get("user-agent") || "External API");

        return NextResponse.json({
            token: sessionToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                material_count: user._count.materials,
                createdAt : user.createdAt

            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        console.error("API Login Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
