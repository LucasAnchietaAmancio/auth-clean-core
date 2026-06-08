import AppError from "../../shared/errors/AppError.js";

export default class InternalApplicationError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "INTERNAL_APPLICATION_ERROR",
            category: "APPLICATION",
            severity: "HIGH",
            type: "INTERNAL",
            message: "Erro interno do servidor",
            metadata: {
                description: "Ocorreu um erro ao processar a operação solicitado no servidor de aplicação.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
