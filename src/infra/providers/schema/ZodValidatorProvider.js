import ISchemaProvider from "../../../domain/contracts/providers/ISchemaProvider.js";
import InvalidSchemaError from "../../errors/InvalidSchemaError.js";
import InternalServerError from "../../errors/InternalServerError.js";

export default class ZodValidatorProvider extends ISchemaProvider {
    constructor({ zod }) {
        super();
        this.z = zod;
    };

    validate({ value, schemaName }) {
        const schemasCatalog = {
            USER_REGISTER: this.z.object({
                name: this.z.string().max(55),
                email: this.z.string().email().max(55),
                password: this.z.string().max(55)
            }),
            LOGIN: this.z.object({
                email: this.z.string().email().max(55),
                password: this.z.string().max(55)
            }),
            USER_PROFILE: this.z.object({
                idUser: this.z.coerce.number().int().positive()
            }),
            LOGOFF: this.z.object({
                refreshToken: this.z.string().min(55)
            }),
            REFRESH: this.z.object({
                refreshToken: this.z.string().min(55)
            })
        };

        const schema = schemasCatalog[schemaName];

        if (!schema) {
            throw new InternalServerError({
                originalError: "Schema nao encontrado no catalogo, para fazer a validacao de entrada."
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
