import AppError from "../../shared/errors/AppError.js";

export default class EncryptionError extends AppError {
    constructor({ originalError, message }) {
        super({
            code: "ENCRYPTION_ERROR",
            category: "SECURITY",
            severity: "CRITICAL",
            type: "INTERNAL",
            message: message || "Erro no serviço de criptografia",
            metadata: {
                description: "Houve uma falha ao processar a operação de hash/comparação.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }

    static handle({ error, message }) {
        if (error instanceof AppError) return error;

        return new EncryptionError({
            originalError: error,
            message: message,
        });
    }
}
