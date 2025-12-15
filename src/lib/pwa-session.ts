import prisma from "@/lib/prisma";
import { AppSession, User } from "@/generated/prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcrypt";

// Session Duration: 30 days (but requires re-check)
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export async function createSessionRecord(userId: string, userAgent?: string, ip?: string) {
    // 1. Invalidate all existing sessions for this user (Single Device Policy)
    await prisma.appSession.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true, revokedAt: new Date() },
    });

    // 2. Create new session
    const sessionToken = randomBytes(32).toString("hex");
    const sessionTokenHash = createHash("sha256").update(sessionToken).digest("hex");

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await prisma.appSession.create({
        data: {
            userId,
            sessionTokenHash,
            expiresAt,
            userAgent,
            ip,
        },
    });

    return { sessionToken, expiresAt };
}

export async function createSession(userId: string, userAgent?: string, ip?: string) {
    const { sessionToken, expiresAt } = await createSessionRecord(userId, userAgent, ip);

    // 3. Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("pwa_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/pwa",
    });

    return sessionToken;
}

export async function validateSessionToken(token: string): Promise<{ user: User; session: AppSession } | null> {
    const sessionTokenHash = createHash("sha256").update(token).digest("hex");

    const session = await prisma.appSession.findUnique({
        where: { sessionTokenHash },
        include: { user: true },
    });

    if (!session) return null;

    // Check validity
    if (session.revoked || new Date() > session.expiresAt) {
        return null; // Invalid
    }

    return { user: session.user, session };
}

export async function validateSession(): Promise<{ user: User; session: AppSession } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("pwa_session")?.value;

    if (!token) return null;

    return validateSessionToken(token);
}

export const getSession = cache(validateSession);

export async function requireAuth() {
    const data = await getSession();
    if (!data) {
        redirect("/pwa/login");
    }
    return data;
}

export async function logout() {
    const data = await getSession();
    if (data) {
        await prisma.appSession.update({
            where: { id: data.session.id },
            data: { revoked: true, revokedAt: new Date() },
        });
    }
    (await cookies()).delete("pwa_session");
    redirect("/pwa/login");
}
