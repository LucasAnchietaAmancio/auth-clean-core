import { z } from "zod";

export const LoginZodSchema = z.object({
    email: z.string().max(55),
    password: z.string().max(55)
});
