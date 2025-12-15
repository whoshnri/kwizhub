"use server";

import bcrypt from "bcrypt";
import  prisma from "@/lib/db";
import { createSession, destroySession, getUserSession, getAdminSession } from "@/lib/session";
import {
    createUserSchema,
    createAdminSchema,
    loginSchema,
    deleteAccountSchema,
    CreateUserInput,
    CreateAdminInput,
    LoginInput,
    DeleteAccountInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type ActionResult<T = void> = {
    success: boolean;
    message: string;
    data?: T;
};

// Rate limiting map (simple in-memory for demo)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempts = loginAttempts.get(identifier);

    if (!attempts) {
        loginAttempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
    }

    // Reset after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
        loginAttempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
    }

    if (attempts.count >= 5) {
        return false;
    }

    loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: now });
    return true;
}

export async function createUser(input: CreateUserInput): Promise<ActionResult> {
    try {
        const validated = createUserSchema.parse(input);

        // Check if email or username exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validated.email },
                    { username: validated.username },
                ],
            },
        });

        if (existingUser) {
            return { success: false, message: "Email or username already exists" };
        }

        const passwordHash = await bcrypt.hash(validated.password, 10);

        const user = await prisma.user.create({
            data: {
                email: validated.email,
                username: validated.username,
                passwordHash,
            },
        });

        await createSession(
            { id: user.id, email: user.email, username: user.username },
            "user"
        );

        return { success: true, message: "Account created successfully" };
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return { success: false, message: "Invalid input data" };
        }
        console.error("Create user error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function userLogin(input: LoginInput): Promise<ActionResult> {
    try {
        const validated = loginSchema.parse(input);

        if (!checkRateLimit(validated.email)) {
            return { success: false, message: "Too many login attempts. Please try again later." };
        }

        const user = await prisma.user.findUnique({
            where: { email: validated.email, deletedAt: null },
        });

        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        const validPassword = await bcrypt.compare(validated.password, user.passwordHash);
        if (!validPassword) {
            return { success: false, message: "Invalid email or password" };
        }

        await createSession(
            { id: user.id, email: user.email, username: user.username },
            "user"
        );

        return { success: true, message: "Login successful" };
    } catch (error) {
        console.error("User login error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function createAdmin(input: CreateAdminInput): Promise<ActionResult> {
    try {
        const validated = createAdminSchema.parse(input);

        // Check if email or username exists
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                OR: [
                    { email: validated.email },
                    { username: validated.username },
                ],
            },
        });

        if (existingAdmin) {
            return { success: false, message: "Email or username already exists" };
        }

        const passwordHash = await bcrypt.hash(validated.password, 10);

        const admin = await prisma.admin.create({
            data: {
                name: validated.name,
                email: validated.email,
                username: validated.username,
                passwordHash,
            },
        });

        await createSession(
            { id: admin.id, email: admin.email, username: admin.username, name: admin.name },
            "admin"
        );

        return { success: true, message: "Admin account created successfully" };
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return { success: false, message: "Invalid input data" };
        }
        console.error("Create admin error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function adminLogin(input: LoginInput): Promise<ActionResult> {
    try {
        const validated = loginSchema.parse(input);

        if (!checkRateLimit(`admin_${validated.email}`)) {
            return { success: false, message: "Too many login attempts. Please try again later." };
        }

        const admin = await prisma.admin.findUnique({
            where: { email: validated.email },
        });

        if (!admin) {
            return { success: false, message: "Invalid email or password" };
        }

        const validPassword = await bcrypt.compare(validated.password, admin.passwordHash);
        if (!validPassword) {
            return { success: false, message: "Invalid email or password" };
        }

        await createSession(
            { id: admin.id, email: admin.email, username: admin.username, name: admin.name },
            "admin"
        );

        return { success: true, message: "Login successful" };
    } catch (error) {
        console.error("Admin login error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function deleteUserAccount(input: DeleteAccountInput): Promise<ActionResult> {
    try {
        const validated = deleteAccountSchema.parse(input);
        const session = await getUserSession();

        if (!session) {
            return { success: false, message: "Not authenticated" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        const validPassword = await bcrypt.compare(validated.password, user.passwordHash);
        if (!validPassword) {
            return { success: false, message: "Invalid password" };
        }

        // Soft delete
        await prisma.user.update({
            where: { id: session.id },
            data: { deletedAt: new Date() },
        });

        await destroySession();
        revalidatePath("/");

        return { success: true, message: "Account deleted successfully" };
    } catch (error) {
        console.error("Delete account error:", error);
        return { success: false, message: "Something went wrong" };
    }
}

export async function logout(): Promise<ActionResult> {
    await destroySession();
    revalidatePath("/");
    return { success: true, message: "Logged out successfully" };
}

export { getUserSession, getAdminSession };
