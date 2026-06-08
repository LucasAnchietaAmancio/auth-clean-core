import EncryptionError from "../../errors/EncryptionError.js";
import IHashProvider from "../../../domain/contracts/providers/IHashProvider.js";

export default class BcryptHashProvider extends IHashProvider {
    constructor({ bcrypt, envs }) {
        super();
        this.bcrypt = bcrypt;
        this.salt = envs.hash.salt;
    }

    async hash({ value }) {
        try {
            return await this.bcrypt.hash(value, this.salt);

        } catch (error) {
            throw EncryptionError.handle({
                error,
                message: "Falha na geração de hash",
            });
        }
    }

    async compare({ value, hash }) {
        try {
            return await this.bcrypt.compare(value, hash);

        } catch (error) {
            throw EncryptionError.handle({
                error,
                message: "Falha na verificação de dados encriptados",
            });
        }
    }
}
