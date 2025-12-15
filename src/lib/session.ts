"use server";

import { cookies } from "next/headers";
import prisma from "./db";

export type SessionUser = {
    id: string;
    email: string;
    username: string;
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

export async function createSession(
    data: Omit<SessionUser, "type"> | Omit<SessionAdmin, "type">,
    type: "user" | "admin"
): Promise<void> {
    const cookieStore = await cookies();
    const session = JSON.stringify({ ...data, type });
    const encoded = Buffer.from(session).toString("base64");

    cookieStore.set(SESSION_COOKIE, encoded, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function getSession(): Promise<Session> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie?.value) {
        return null;
    }

    try {
        const decoded = Buffer.from(sessionCookie.value, "base64").toString();
        const session = JSON.parse(decoded) as Session;
        return session;
    } catch {
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

// Generate signed download token
