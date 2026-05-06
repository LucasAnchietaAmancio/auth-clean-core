export default class InfrastructureErrors extends Error {
    constructor({ message, code, description, type, details, cause }) {
        super(message, { cause });
        this.code = code;
        this.type = type || "INFRASTRUCTURE_ERROR";
        this.description = description || null;
        this.details = details || null;
        this.timestamp = new Date();
    };

    static databaseError({ message, description, errorClientCode, originalError }) {
        return new InfrastructureErrors({
            message,
            description,
            code: "ID500",
            type: "DATABASE_INTERNAL_ERROR",
            details: {
                errorClientCode: errorClientCode || "UNKNOWN"
            },
            cause: originalError
        });
    };

    static connectionExternalServiceError({ message, description, errorClientCode, originalError }) {
        return new InfrastructureErrors({
            message,
            description,
            code: "IC500",
            type: "CONNECTION_EXTERNAL_SERVICE_ERROR",
            details: {
                errorClientCode: errorClientCode || "UNKNOWN"
            },
            cause: originalError
        });
    };

    static internalServerError({ message, description, originalError }) {
        return new InfrastructureErrors({
            message,
            description,
            code: "II500",
            type: "INTERNAL_SERVER_ERROR",
            cause: originalError
        });
    };

    static providerError({ message, description, details, originalError }) {
        return new InfrastructureErrors({
            message,
            description,
            code: "IP500",
            type: "PROVIDER_INTERNAL_ERROR",
            details: details || null,
            cause: originalError
        });
    };
};
