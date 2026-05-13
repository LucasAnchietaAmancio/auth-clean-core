import AppError from "../../shared/errors/AppError.js";

export default class ResourceNotFoundError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "RESOURCE_NOT_FOUND",
            category: "APPLICATION",
            severity: "LOW",
            type: "NOT_FOUND",
            message: "Recurso não encontrado",
            metadata: {
                description: "O recurso solicitado não pôde ser encontrado no sistema.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
