import { z } from "zod";
import { DEPARTMENTS, LEVELS } from "./constants";

// Auth schemas
export const createUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters"),
});

export const createAdminSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Material schemas
export const uploadMaterialSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    course: z.string().min(2, "Course code is required"),
    courseCode: z.string().min(2, "Course code is required"),
    semester: z.enum(["FIRST", "SECOND"]),
    price: z.number().min(0, "Price must be positive"),
    coauthor: z.string().optional(), // Now expects an ID
    equityPercentage: z.number().min(0).max(100).optional(),
    referralPercentage: z.number().min(0).max(100).optional(),
});

export const editMaterialSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    course: z.string().min(2, "Course code is required").optional(),
    courseCode: z.string().min(2, "Course code is required").optional(),
    semester: z.enum(["FIRST", "SECOND"]).optional(),
    price: z.number().min(0, "Price must be positive").optional(),
    coauthor: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    equityPercentage: z.number().min(0).max(100).optional(),
    referralPercentage: z.number().min(0).max(100).optional(),
});

// Order schemas
export const createOrderSchema = z.object({
    materialId: z.string().uuid(),
    referralCode: z.string().optional(),
});

// Withdrawal schemas
export const requestWithdrawalSchema = z.object({
    amount: z.number().min(1000, "Minimum withdrawal is ₦1,000"),
    bankName: z.string().min(2, "Bank name is required"),
    accountName: z.string().min(2, "Account name is required"),
    accountNo: z.string().min(10, "Account number must be 10 digits").max(10, "Account number must be 10 digits"),
});

export const approveWithdrawalSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(["APPROVED", "REJECTED", "PAID"]),
});

// Account schemas
export const deleteAccountSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UploadMaterialInput = z.infer<typeof uploadMaterialSchema>;
export type EditMaterialInput = z.infer<typeof editMaterialSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type RequestWithdrawalInput = z.infer<typeof requestWithdrawalSchema>;
export type ApproveWithdrawalInput = z.infer<typeof approveWithdrawalSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
