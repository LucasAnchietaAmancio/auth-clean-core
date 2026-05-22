import AppError from "../../shared/errors/AppError.js";

export default class InvalidTokenError extends AppError {
    constructor({ originalError }) {
        super({
            code: "INVALID_TOKEN",
            category: "APPLICATION",
            severity: "LOW",
            type: "INTERNAL",
            message: "Token inválido",
            metadata: {
                description: "Token de autenticação inválido ou expirado.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
