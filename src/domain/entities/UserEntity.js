import EmailValueObject from "../value-objects/EmailValueObject.js";
import PasswordValueObject from "../value-objects/PasswordValueObject.js";
import NameValueObject from "../value-objects/NameValueObject.js";

export default class UserEntity {
    constructor({ id, email, password, name, alreadyHashed = false }) {
        this.id = id || null;
        this.name = new NameValueObject({ value: name, entityName: "UserEntity" });
        this.email = new EmailValueObject({ value: email, entityName: "UserEntity" });
        this.password = password
            ? new PasswordValueObject({ value: password, entityName: "UserEntity", alreadyHashed })
            : null;
    };

    updatePassword({ hashedPassword }) {
        this.password = new PasswordValueObject({
            value: hashedPassword,
            entityName: "UserEntity",
            alreadyHashed: true
        });
    };
};

