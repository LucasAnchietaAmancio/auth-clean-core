
export default class ApplicationErrors extends Error {
    constructor({ message, code, httpStatus, description, type, details, cause }) {
        super(message, { cause });
        this.code = code;
        this.httpStatus = httpStatus;
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
            httpStatus: 400,
            type: "BAD_REQUEST_ERROR",
            details
        });
    };

    static conflict({ message, description }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AC409",
            httpStatus: 409,
            type: "CONFLICT_ERROR"
        });
    };

    static internalError({ message, description, originalError }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AI500",
            httpStatus: 500,
            type: "INTERNAL_SERVER_ERROR",
            cause: originalError
        });
    };

    static unauthorized({ message, description }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AU401",
            httpStatus: 401,
            type: "UNAUTHORIZED_ERROR"
        });
    };

    static notFound({ message, description, details }) {
        return new ApplicationErrors({
            message,
            description,
            code: "AN404",
            httpStatus: 404,
            type: "NOT_FOUND_ERROR",
            details
        });
    };
};
