import ISchemaProvider from "../../../domain/contracts/providers/ISchemaProvider.js";
import InvalidSchemaError from "../../errors/InvalidSchemaError.js";
import InternalServerError from "../../errors/InternalServerError.js";

export default class ZodValidatorProvider extends ISchemaProvider {
    constructor({ catalog }) {
        super();
        this.catalog = catalog;
    };

    validate({ value, schemaName }) {
        const schema = this.catalog[schemaName];

        if (!schema) {
            throw new InternalServerError({
                originalError: "Schema não encontrado no catálogo, para fazer a validação de entrada."
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