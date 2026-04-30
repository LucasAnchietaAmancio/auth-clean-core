
export default class ApplicationErrors extends Error {
    constructor({ message, code, description, type, details, cause }) {
        super(message, { cause });
        this.code = code;
        this.type = type || "APPLICATION_ERROR";
        this.description = description || null;
        this.details = details || null;
        this.timestamp = new Date().toISOString();
    };

    static badRequest({ message, description, details }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AB400",
            type: "BAD_REQUEST_ERROR",
            details
        });
    };

    static conflict({ message, description }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AC409",
            type: "CONFLICT_ERROR"
        });
    };

    static internalError({ message, description, originalError }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AI500",
            type: "INTERNAL_SERVER_ERROR",
            cause: originalError
        });
    };
};
