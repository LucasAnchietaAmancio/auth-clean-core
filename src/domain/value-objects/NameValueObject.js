import DomainErros from "../erros/DomainErros.js";

export default class NameValueObject {
    constructor({ value, entityName }) {
        if (!value || typeof value !== "string" || value.trim().length < 3) {
            throw DomainErros.fieldsValidationError("Nome inválido, deve ter pelo menos 3 caracteres", "name", entityName);
        }
        this.value = value;
    }
}
