import AppError from "../../shared/errors/AppError.js";

export default class InvalidEmailError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "INVALID_EMAIL",
            category: "DOMAIN",
            severity: "LOW",
            type: "VALIDATION",
            message: "E-mail inválido",
            metadata: {
                description: "O formato do e-mail fornecido não é válido.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}