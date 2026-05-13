import AppError from "../../shared/errors/AppError.js";

export default class TooManyRequestsError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "TOO_MANY_REQUESTS",
            category: "PRESENTATION",
            severity: "MEDIUM",
            type: "RATE_LIMITED",
            message: "Muitas requisições",
            metadata: {
                description: "Você excedeu o limite de requisições permitido. Tente novamente mais tarde.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
