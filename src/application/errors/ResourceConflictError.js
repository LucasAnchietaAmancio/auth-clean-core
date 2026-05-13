import AppError from "../../shared/errors/AppError.js";

export default class ResourceConflictError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "RESOURCE_CONFLICT",
            category: "APPLICATION",
            severity: "LOW",
            type: "CONFLICT",
            message: "Conflito de recurso",
            metadata: {
                description: "O recurso que você está tentando criar ou modificar já existe ou está em conflito.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
