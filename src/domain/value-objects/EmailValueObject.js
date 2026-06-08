import InvalidEmailError from "../errors/InvalidEmailError.js";

export default class EmailValueObject {
    static #emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    constructor({ value }) {
        this.value = value;
    };

    static create({ email }) {
        if (!email || !EmailValueObject.#emailRegex.test(email)) {
            throw new InvalidEmailError({ originalError: "E-mail não condiz com a formatação de e-mails válida" });
        }
        return new EmailValueObject({ value: email });
    };

    static restore({ email }) {
        return new EmailValueObject({ value: email });
    };
};