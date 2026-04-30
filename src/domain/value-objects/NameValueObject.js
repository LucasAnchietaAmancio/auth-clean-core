import DomainErros from "../erros/DomainErros.js";

export default class NameValueObject {
    constructor({ value, entityName }) {

        if (!value || typeof value !== "string" || value.trim().length < 3) {
            throw DomainErros.fieldsValidationError({
                message: "Nome inválido",
                description: "Certifique-se de que o nome tenha pelo menos 3 caracteres",
                fieldName: "name",
                entityName
            });
        }

        this.value = value;
    }
}
