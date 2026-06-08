import AppError from "../../shared/errors/AppError.js";

export default class InvalidNameError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "INVALID_NAME",
            category: "DOMAIN",
            severity: "LOW",
            type: "VALIDATION",
            message: "Nome inválido",
            metadata: {
                description: "O nome fornecido não atende aos requisitos mínimos de caracteres.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}