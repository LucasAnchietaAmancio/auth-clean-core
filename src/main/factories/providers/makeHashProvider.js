import bcrypt from "bcrypt";
import BcryptHashProvider from "../../../infra/providers/hash/BcryptHashProvider.js";

export const makeHashProvider = ({ envs }) => {
    return new BcryptHashProvider({ bcrypt, envs });
};
