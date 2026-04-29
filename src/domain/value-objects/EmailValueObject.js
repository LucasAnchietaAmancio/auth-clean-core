import DomainErros from "../erros/DomainErros.js";

export default class EmailValueObject {
    constructor({ value, entityName }) {

        const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

        if (!emailRegex.test(value)) {
            throw DomainErros.fieldsValidationError("Email inválido, digite um email válido", "email", entityName);
        }

        this.value = value;
    }
}