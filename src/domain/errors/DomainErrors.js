
export default class DomainErrors extends Error {
    constructor({ message, code, description, type, details }) {
        super(message);
        this.code = code;
        this.type = type || "DOMAIN_ERROR";
        this.description = description || null;
        this.details = details || null;
    };

    static fieldsValidationError({ message, description, fieldName, entityName }) {
        return new DomainErrors({
            message,
            description,
            code: "DF400",
            type: "FIELD_VALIDATION_ERROR",
            details: {
                where: entityName,
                field: fieldName,
            }
        });
    };
};
