import AppError from "../../shared/errors/AppError.js";

export default class CacheError extends AppError {
    constructor({ originalError, message }) {
        super({
            code: "CACHE_ERROR",
            category: "SECURITY",
            severity: "CRITICAL",
            type: "INTERNAL",
            message: message || "Erro no serviço de cache",
            metadata: {
                description: "Houve uma falha ao processar a operação de cache.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }

    static handle({ error, message }) {
        if (error instanceof AppError) return error;

        return new CacheError({
            originalError: error,
            message: message,
        });
    }
}
