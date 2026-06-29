import { z } from "zod";

const instituteEmailRegex = /^[a-zA-Z0-9._%+-]+@itbhu\.ac\.in$/;

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(50),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .regex(
            instituteEmailRegex,
            "Only IIT BHU institute email addresses are allowed."
        ),

    password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});