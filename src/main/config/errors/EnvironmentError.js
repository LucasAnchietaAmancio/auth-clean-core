import AppError from "../../../shared/errors/AppError.js";

export default class EnvironmentError extends AppError {
    constructor({ key, message }) {
        super({
            code: "ENVIRONMENT_CONFIGURATION_ERROR",
            category: "INFRASTRUCTURE",
            severity: "CRITICAL",
            type: "INTERNAL",
            message: "Erro de configuração de ambiente",
            metadata: {
                description: message,
                key: key
            }
        });
    }
}
