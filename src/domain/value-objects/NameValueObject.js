import InvalidNameError from "../errors/InvalidNameError.js";

export default class NameValueObject {
    constructor({ value }) {
        this.value = value;
    }

    static create({ name }) {
        if (!name || typeof name !== "string" || name.trim().length < 3) {
            throw new InvalidNameError({ originalError: "Nome não condiz com a formatação de nome válida" });
        }
        return new NameValueObject({ value: name });
    }

    static restore({ name }) {
        return new NameValueObject({ value: name });
    }
}
