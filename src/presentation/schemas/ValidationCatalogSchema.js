import { registerSchema } from "./users/RegisterSchema.js";
import { loginSchema } from "./auth/LoginSchema.js";

export const ValidationCatalog = {
    USER_REGISTER: registerSchema,
    USER_LOGIN: loginSchema
};