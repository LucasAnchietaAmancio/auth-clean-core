import ZodValidatorProvider from "../../../infra/providers/schema/ZodValidatorProvider.js";
import ValidationSchemaMiddleware from "../../../presentation/middlewares/ValidationSchemaMiddleware.js";

export const makeValidationSchemaMiddleware = () => {
    const validatorProvider = new ZodValidatorProvider();
    return new ValidationSchemaMiddleware({ validatorProvider });
};
