import AppError from "../../shared/errors/AppError.js";

export default class ConnectionRefusedError extends AppError {
    constructor({ originalError }) {
        super({
            code: "CONNECTION_REFUSED",
            category: "INFRASTRUCTURE",
            severity: "HIGH",
            type: "UNAVAILABLE",
            message: "Conexão recusada",
            metadata: {
                description: "Houve uma falha ao processar a operação no banco de dados.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
