import ValidationSchemaMiddleware from "../../../presentation/middlewares/ValidationSchemaMiddleware.js";
import { makeValidatorProvider } from "../providers/makeValidatorProvider.js";

export const makeValidationSchemaMiddleware = () => {
    return new ValidationSchemaMiddleware({
        validatorProvider: makeValidatorProvider()
    });
};
