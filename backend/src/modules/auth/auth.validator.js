import { z } from "zod";

const instituteEmailRegex = /^[a-zA-Z0-9._%+-]+@itbhu\.ac\.in$/;

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email")
        .transform((email) => email.toLowerCase())
        .refine(
            (email) => instituteEmailRegex.test(email),
            "Only IIT BHU institute email addresses are allowed."
        ),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email")
        .transform((email) => email.toLowerCase()),

    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email")
        .transform((email) => email.toLowerCase()),
});

// token comes from req.query — only password is validated from the body
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});
