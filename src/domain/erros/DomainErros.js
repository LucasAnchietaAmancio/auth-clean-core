
export default class DomainErros extends Error {
    constructor({ message, code, type, details }) {
        super(message);
        this.code = code;
        this.type = type || "DOMAIN_ERROR";
        this.details = details || null;
    }

    static fieldsValidationError(message, fieldName, entityName) {
        return new DomainErros({
            message,
            code: "DEE02",
            type: "FIELD_VALIDATION_ERROR",
            details: {
                where: entityName,
                field: fieldName,
            }
        });
    }
}
