
export default class AppError extends Error {
    constructor({ message, code, category, severity, type, metadata = {} }) {
        super(message);
        this.code = code;
        this.category = category;
        this.severity = severity;
        this.type = type;
        this.metadata = metadata;
        this.timestamp = new Date().toISOString();
    };
};