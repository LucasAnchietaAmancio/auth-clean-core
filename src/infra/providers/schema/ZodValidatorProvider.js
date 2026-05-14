import ISchemaProvider from "../../../domain/contracts/providers/ISchemaProvider.js";
import InvalidSchemaError from "../../../shared/errors/InvalidSchemaError.js";

export default class ZodValidatorProvider extends ISchemaProvider {
    constructor({ catalog }) {
        super();
        this.catalog = catalog;
    };

    validate({ value, schemaName }) {
        const schema = this.catalog[schemaName];

        if (!schema) {
            throw new InvalidSchemaError({
                originalError: "Schema não encontrado no catálogo."
            });
        }

        const validation = schema.safeParse(value);

        if (!validation.success) {
            throw new InvalidSchemaError({
                originalError: validation.error.issues
            });
        }

        return validation.data;
    }
}