"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import prisma from "./db";

export type SessionUser = {
    id: string;
    email: string;
    username: string;
    name?: string;
    type: "user";
};

export type SessionAdmin = {
    id: string;
    email: string;
    username: string;
    name: string;
    type: "admin";
};

export type Session = SessionUser | SessionAdmin | null;

const SESSION_COOKIE = "kwizhub_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set");
    return new TextEncoder().encode(secret);
}

export async function createSession(
    data: Omit<SessionUser, "type"> | Omit<SessionAdmin, "type">,
    type: "user" | "admin"
): Promise<void> {
    const payload = { ...data, type };

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(getSecret());

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
}

export async function getSession(): Promise<Session> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getSecret());
        const session = payload as unknown as Session;
        if (!session?.type || !["user", "admin"].includes(session.type)) {
            return null;
        }
        return session;
    } catch {
        // Expired, tampered, or invalid token
        return null;
    }
}

export async function getUserSession(): Promise<SessionUser | null> {
    const session = await getSession();
    if (session?.type === "user") {
        // Verify user still exists and is not deleted
        const user = await prisma.user.findUnique({
            where: { id: session.id, deletedAt: null },
        });
        if (!user) return null;
        return session;
    }
    return null;
}

export async function getAdminSession(): Promise<SessionAdmin | null> {
    const session = await getSession();
    if (session?.type === "admin") {
        // Verify admin still exists
        const admin = await prisma.admin.findUnique({
            where: { id: session.id },
        });
        if (!admin) return null;
        return session;
    }
    return null;
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
