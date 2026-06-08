import AppError from "../../shared/errors/AppError.js";

export default class InvalidSchemaError extends AppError {
    constructor({ originalError }) {
        super({
            code: "INVALID_SCHEMA",
            category: "INFRASTRUCTURE",
            severity: "LOW",
            type: "INPUT",
            message: "Esquema de dados inválido",
            metadata: {
                description: "Os dados fornecidos não correspondem ao formato esperado.",
                cause: originalError?.message || originalError || undefined
            }
        });
    }
}