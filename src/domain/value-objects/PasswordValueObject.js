import DomainErrors from "../errors/DomainErrors.js";

export default class PasswordValueObject {
    constructor({ value, entityName, alreadyHashed = false }) {
        const passwordRegex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$");

        if (!alreadyHashed && (!passwordRegex.test(value) || !value)) {
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