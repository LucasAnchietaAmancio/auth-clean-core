
import ISchemaProvider from "../../../domain/contracts/providers/ISchemaProvider.js";
import InvalidSchemaError from "../../errors/InvalidSchemaError.js";

export default class ZodValidatorProvider extends ISchemaProvider {
    constructor() {
        super();
    };

    validate({ value, schema }) {
        const validation = schema.safeParse(value);

        if (!validation.success) {
            throw new InvalidSchemaError({
                originalError: validation.error.issues
            });
        }

        return validation.data;
    }
};