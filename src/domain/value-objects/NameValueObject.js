import InvalidNameError from "../errors/InvalidNameError.js";

export default class NameValueObject {
    constructor({ value }) {
        if (!value || typeof value !== "string" || value.trim().length < 3) {
            throw new InvalidNameError({ originalError: `Nome: ${value} não condiz com a formatação de nome válida` });
        }

        this.value = value;
    }
}
