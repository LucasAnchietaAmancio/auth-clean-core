import ZodValidatorProvider from "../../../infra/providers/schema/ZodValidatorProvider.js";
import ValidationSchemaMiddleware from "../../../presentation/middlewares/ValidationSchemaMiddleware.js";
import { UserRegisterZodSchema } from "../../../infra/providers/schema/zod/schemas/UserRegisterZodSchema.js";
import { LoginZodSchema } from "../../../infra/providers/schema/zod/schemas/LoginZodSchema.js";

export const makeValidationSchemaMiddleware = () => {
    const catalog = {
        USER_REGISTER: UserRegisterZodSchema,
        USER_LOGIN: LoginZodSchema,
    };

    const validatorProvider = new ZodValidatorProvider({
        catalog
    });

    return new ValidationSchemaMiddleware({ validatorProvider });
};
