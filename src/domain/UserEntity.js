import EmailValueObject from "./value-objects/EmailValueObject.js";
import PasswordValueObject from "./value-objects/PasswordValueObject.js";
import NameValueObject from "./value-objects/NameValueObject.js";

export default class UserEntity {
    constructor({ email, password, name }) {
        this.name = new NameValueObject({ value: name, entityName: "UserEntity" });
        this.email = new EmailValueObject({ value: email, entityName: "UserEntity" });
        this.password = new PasswordValueObject({ value: password, entityName: "UserEntity" });
    };
}