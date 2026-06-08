import AppError from "../../shared/errors/AppError.js";

export default class EmailAlreadyInUseError extends AppError {
    constructor({ originalError } = {}) {
        super({
            code: "EMAIL_ALREADY_IN_USE",
            category: "APPLICATION",
            severity: "LOW",
            type: "CONFLICT",
            message: "E-mail já cadastrado",
            metadata: {
                description: "O e-mail informado já está em uso por outra conta.",
                cause: originalError ? (originalError.message || originalError) : undefined
            }
        });
    }
}
