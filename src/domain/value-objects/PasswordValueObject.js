import InvalidPasswordError from "../errors/InvalidPasswordError.js";

export default class PasswordValueObject {
    static #passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;

    constructor({ value, alreadyHashed = false }) {
        if (alreadyHashed) {
            if (!value) {
                throw new InvalidPasswordError({ originalError: "HASH_PASSWORD_NOT_EXIST" });
            }
            this.value = value;
            return;
        }

        if (!value || !PasswordValueObject.#passwordRegex.test(value)) {
            throw new InvalidPasswordError({ originalError: `Senha: ${value} não condiz com a formatação de senha válida` });
        }

        this.value = value;
    }
}