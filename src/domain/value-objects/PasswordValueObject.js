import InvalidPasswordError from "../errors/InvalidPasswordError.js";

export default class PasswordValueObject {
    static #passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;

    constructor({ value }) {
        this.value = value;
    }

    static create({ password }) {
        if (!password || !PasswordValueObject.#passwordRegex.test(password)) {
            throw new InvalidPasswordError({ originalError: "Senha não condiz com a formatação de senha válida" });
        }
        return new PasswordValueObject({ value: password });
    }

    static restore({ hashedPassword }) {
        if (!hashedPassword) {
            throw new InvalidPasswordError({ originalError: "Hash da senha não foi fornecido" });
        }
        return new PasswordValueObject({ value: hashedPassword });
    }
}