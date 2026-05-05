import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().max(100),
    email: z.string().max(255),
    password: z.string().max(255)
});

export const loginSchema = z.object({
    email: z.string().max(255),
    password: z.string().max(255)
});