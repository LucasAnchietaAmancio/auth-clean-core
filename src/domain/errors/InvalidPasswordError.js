import AppError from "../../shared/errors/AppError.js";

export default class InvalidPasswordError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "INVALID_PASSWORD",
            category: "DOMAIN",
            severity: "LOW",
            type: "VALIDATION",
            message: "Senha inválida",
            metadata: {
                description: "A senha fornecida não atende aos requisitos mínimos de segurança.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}