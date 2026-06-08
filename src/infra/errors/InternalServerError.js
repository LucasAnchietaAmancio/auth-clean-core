import AppError from "../../shared/errors/AppError.js";

export default class InternalServerError extends AppError {
    constructor({ originalError }) {
        super({
            code: "INTERNAL_SERVER_ERROR",
            category: "SYSTEM",
            severity: "HIGH",
            type: "INTERNAL",
            message: "Erro interno do servidor",
            metadata: {
                description: "Ocorreu um erro inesperado no servidor.",
                cause: originalError?.message || originalError || undefined
            }
        });
    }
}