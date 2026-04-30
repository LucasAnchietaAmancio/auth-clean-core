import DomainErrors from "../errors/DomainErrors.js";

export default class EmailValueObject {
    constructor({ value, entityName }) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (typeof value !== "string" || !emailRegex.test(value) || !value) {
            throw DomainErrors.fieldsValidationError({
                message: "Email inválido",
                description: "Certifique-se de que o email informado seja uma string válida e contenha @ e domínio (ex: usuario@dominio.com)",
                fieldName: "email",
                entityName
            });
        }

        this.value = value;
    }
}