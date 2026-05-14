import { z } from "zod";

export const UserRegisterZodSchema = z.object({
    name: z.string().max(55),
    email: z.string().max(55),
    password: z.string().max(55)
});
