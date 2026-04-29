import DomainErros from "../erros/DomainErros.js";

export default class PasswordValueObject {
    constructor({ value, entityName }) {
        // Usando formato literal para evitar problemas de escape com strings
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;

        if (!passwordRegex.test(value)) {
            throw DomainErros.fieldsValidationError("Senha inválida, a senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial, além de ter no mínimo 8 caracteres", "password", entityName);
        }

        this.value = value;
    }
}