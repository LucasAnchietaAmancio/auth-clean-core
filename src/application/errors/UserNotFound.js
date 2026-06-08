import AppError from "../../shared/errors/AppError.js";

export default class UserNotFound extends AppError {
    constructor({ originalError }) {
        super({
            code: "USER_NOT_FOUND",
            category: "APPLICATION",
            severity: "MEDIUM",
            type: "NOT_FOUND",
            message: "Usuário não encontrado",
            metadata: {
                description: "Usuário não encontrado, ou id inválido",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
