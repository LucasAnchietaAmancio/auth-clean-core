import ZodValidatorProvider from "../../../infra/providers/schema/ZodValidatorProvider.js";
import ValidationSchemaMiddleware from "../../../presentation/middlewares/ValidationSchemaMiddleware.js";
import { ValidationCatalog } from "../../../presentation/schemas/ValidationCatalogSchema.js";

export const makeValidationSchemaMiddleware = () => {
    const validatorProvider = new ZodValidatorProvider({ 
        catalog: ValidationCatalog
    });
    
    return new ValidationSchemaMiddleware({ validatorProvider });
};
