import AppError from "../../shared/errors/AppError.js";

export default class InvalidCredentialsError extends AppError {
    constructor({ originalError }) {
        super({
            code: "INVALID_CREDENTIALS",
            category: "APPLICATION",
            severity: "LOW",
            type: "UNAUTHORIZED",
            message: "Credenciais inválidas",
            metadata: {
                description: "Email ou senha incorretos.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
