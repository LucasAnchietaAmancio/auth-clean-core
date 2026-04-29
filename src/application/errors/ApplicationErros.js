
export default class ApplicationErrors extends Error {
    constructor({ message, code, description, type, details }) {
        super(message);
        this.code = code;
        this.type = type || "APPLICATION_ERROR";
        this.description = description || null;
        this.details = details || null;
    };

    static conflict(message, description) {
        return new ApplicationErrors({
            message,
            description,
            code: "AC409",
            type: "CONFLICT_ERROR"
        });
    };
};
