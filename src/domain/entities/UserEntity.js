import EmailValueObject from "../value-objects/EmailValueObject.js";
import PasswordValueObject from "../value-objects/PasswordValueObject.js";
import NameValueObject from "../value-objects/NameValueObject.js";
import InvalidDomainParams from "../errors/InvalidDomainParams.js";

export default class UserEntity {
    constructor({ idUser, email, password, name }) {
        this.idUser = idUser;
        this.name = name;
        this.email = email;
        this.password = password;
    };

    static create({ email, password, name }) {
        return new UserEntity({
            email: EmailValueObject.create({ email }),
            password: PasswordValueObject.create({ password }),
            name: NameValueObject.create({ name })
        });
    };

    updatePassword({ hashedPassword }) {
        this.password = PasswordValueObject.restore({ hashedPassword });
    };

    static restore({ idUser, name, email, hashedPassword }) {
        if (!idUser || !name || !email || !hashedPassword) {
            throw new InvalidDomainParams({ originalError: "Dados insuficientes para reconstrução da entidade" });
        }
        return new UserEntity({ idUser, email: EmailValueObject.restore({ email }), password: PasswordValueObject.restore({ hashedPassword }), name: NameValueObject.restore({ name }) });
    };
};
