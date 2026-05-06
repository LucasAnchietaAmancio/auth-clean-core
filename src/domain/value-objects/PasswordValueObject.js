import DomainErrors from "../errors/DomainErrors.js";

export default class PasswordValueObject {
    static #passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;

    constructor({ value, entityName, alreadyHashed = false }) {

        if (alreadyHashed) {
            if (!value) {
                throw DomainErrors.fieldsValidationError({
                    message: "Hash de senha inválido",
                    description: "Um hash de senha existente não pode ser nulo ou vazio.",
                    fieldName: "password",
                    entityName
                });
            }
            this.value = value;
            return;
        }

        if (!value || !PasswordValueObject.#passwordRegex.test(value)) {
            throw DomainErrors.fieldsValidationError({
                message: "Senha inválida",
                description: "Certifique-se de que a senha seja forte (mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial)",
                fieldName: "password",
                entityName
            });
        }

        this.value = value;
    }
}