export default class PresentationErrors extends Error {
    constructor({ message, description, code, httpStatus, type, details, cause }) {
        super(message);
        this.name = "PresentationErrors";
        this.code = code;
        this.httpStatus = httpStatus;
        this.type = type;
        this.description = description;
        this.details = details;
        this.cause = cause;
        this.timestamp = new Date().toISOString();
    }

    static tooManyRequests({ message, description }) {
        return new PresentationErrors({
            message: message || "Limite de requisições excedido",
            description: description || "Você realizou muitas requisições em um curto período de tempo.",
            code: "PI429",
            httpStatus: 429,
            type: "TOO_MANY_REQUESTS_ERROR"
        });
    }

    static notFound({ message, description }) {
        return new PresentationErrors({
            message: message || "Recurso não encontrado",
            description: description || "O endpoint solicitado não existe nesta API.",
            code: "PN404",
            httpStatus: 404,
            type: "RESOURCE_NOT_FOUND_ERROR"
        });
    }

    static badRequest({ message, description, details }) {
        return new PresentationErrors({
            message: message || "Requisição inválida",
            description: description || "A requisição enviada não pôde ser processada devido a erros de sintaxe ou validação.",
            code: "PF400",
            httpStatus: 400,
            type: "BAD_REQUEST_ERROR",
            details
        });
    }
}
