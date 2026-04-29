import DomainErros from "../erros/DomainErros.js";

export default class PasswordValueObject {
    constructor({ value, entityName }) {
        const passwordRegex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$");

        if (!passwordRegex.test(value) || !value) {
            throw DomainErros.fieldsValidationError("Senha inválida", "Certifique-se de que a senha seja forte (mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial)", "password", entityName);
        }

        this.value = value;
    }
}