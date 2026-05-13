import AppError from "../../shared/errors/AppError.js";

export default class RouteNotFoundError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "ROUTE_NOT_FOUND",
            category: "PRESENTATION",
            severity: "LOW",
            type: "NOT_FOUND",
            message: "Rota não encontrada",
            metadata: {
                description: "A rota solicitada não existe ou foi movida.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
