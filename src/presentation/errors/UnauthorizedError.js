import AppError from "../../shared/errors/AppError.js";

export default class UnauthorizedError extends AppError {
    constructor({ originalError }) {
        super({
            code: "UNAUTHORIZED_USER",
            category: "PRESENTATION",
            severity: "MEDIUM",
            type: "UNAUTHORIZED",
            message: "Usuário não autenticado",
            metadata: {
                description: "Token de autenticação é inválido para essa requisição.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}