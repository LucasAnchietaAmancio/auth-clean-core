import AppError from "../../shared/errors/AppError.js";

export default class TokenError extends AppError {
    constructor({ originalError, message }) {
        super({
            code: "TOKEN_ERROR",
            category: "SECURITY",
            severity: "HIGH",
            type: "UNAUTHENTICATION",
            message: message,
            metadata: {
                description: "Houve uma falha ao processar a operação de token.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }

    static handle({ error, message }) {
        if (error instanceof AppError) return error;

        return new TokenError({
            originalError: error,
            message: message || "Erro no serviço de tokens",
        });
    }
}
