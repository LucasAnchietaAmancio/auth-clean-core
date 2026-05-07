
export default class DomainErrors extends Error {
    constructor({ message, code, httpStatus, description, type, details }) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
        this.type = type || "DOMAIN_ERROR";
        this.description = description || null;
        this.details = details || null;
        this.timestamp = new Date().toISOString();
    };

    static fieldsValidationError({ message, description, fieldName, entityName }) {
        return new DomainErrors({
            message,
            description,
            code: "DF400",
            httpStatus: 400,
            type: "FIELD_VALIDATION_ERROR",
            details: {
                where: entityName,
                field: fieldName,
            }
        });
    };

    static refreshTokenExpiredError() {
        return new DomainErrors({
            message: "Refresh token expirado",
            code: "DF400",
            httpStatus: 400,
            type: "REFRESH_TOKEN_EXPIRED_ERROR"
        });
    }
};
