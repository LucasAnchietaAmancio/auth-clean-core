import EmailValueObject from "../value-objects/EmailValueObject.js";
import PasswordValueObject from "../value-objects/PasswordValueObject.js";
import NameValueObject from "../value-objects/NameValueObject.js";

export default class UserEntity {
    constructor({ id, email, password, name, alreadyHashed = false }) {
        this.id = id || null;
        this.name = new NameValueObject({ value: name });
        this.email = new EmailValueObject({ value: email });
        this.password = new PasswordValueObject({ value: password, alreadyHashed });
    };

    updatePassword({ hashedPassword }) {
        this.password = new PasswordValueObject({
            value: hashedPassword,
            alreadyHashed: true
        });
    };
};

