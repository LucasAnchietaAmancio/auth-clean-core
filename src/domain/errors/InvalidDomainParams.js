import AppError from "../../shared/errors/AppError.js";

export default class InvalidDomainParams extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "INVALID_DOMAIN_PARAMS",
            category: "DOMAIN",
            severity: "LOW",
            type: "VALIDATION",
            message: "Parâmetros inválidos",
            metadata: {
                description: "Os parâmetros passados para a entidade não são válidos.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}