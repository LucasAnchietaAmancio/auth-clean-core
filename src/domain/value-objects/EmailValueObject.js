import InvalidEmailError from "../errors/InvalidEmailError.js";

export default class EmailValueObject {
    constructor({ value }) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (typeof value !== "string" || !emailRegex.test(value) || !value) {
            throw new InvalidEmailError({ originalError: `E-mail: ${value} não condiz com a formatação de e-mails válida` });
        }

        this.value = value;
    }
}