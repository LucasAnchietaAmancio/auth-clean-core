import bcrypt from "bcrypt";
import IHashProvider from "../../../application/interfaces/IHashProvider.js";

export default class BcryptHashProvider extends IHashProvider {

    async hash({ password }) {
        return await bcrypt.hash(password, 10);
    };

    async compare({ password, hash }) {
        return await bcrypt.compare(password, hash);
    };
};