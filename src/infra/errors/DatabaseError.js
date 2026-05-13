import AppError from "../../shared/errors/AppError.js";

export default class DatabaseError extends AppError {
    constructor({ originalError, message }) {
        super({
            code: "DATABASE_ERROR",
            category: "INFRASTRUCTURE",
            severity: "HIGH",
            type: "INTERNAL",
            message: message || "Erro de persistência",
            metadata: {
                description: "Houve uma falha ao processar a operação no banco de dados.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }

    static handle({ error, message }) {
        if (error instanceof AppError) return error;

        return new DatabaseError({
            originalError: error,
            message: message,
        });
    }
}
