import UserRepository from "../../../infra/db/repositories/UserRepository.js";
import BcryptHashProvider from "../../../infra/providers/hash/BcryptHashProvider.js";
import CreateUserUseCase from "../../../application/use-cases/user/CreateUserUseCase.js";
import CreateUserController from "../../../presentation/controllers/user/CreateUserController.js";
import bcrypt from "bcrypt";

export const makeCreateUserController = ({ envs, db }) => {
    const userRepository = new UserRepository({ db });
    const hashProvider = new BcryptHashProvider({ bcrypt, envs });
    const createUserUseCase = new CreateUserUseCase({ userRepository, hashProvider });
    return new CreateUserController({ createUserUseCase });
};
