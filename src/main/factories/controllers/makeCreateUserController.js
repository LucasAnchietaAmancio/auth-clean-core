import UserRepository from "../../../infra/db/repositories/UserRepository.js";
import BcryptHashProvider from "../../../infra/providers/BcryptHashProvider.js";
import CreateUserUseCase from "../../../application/use-cases/user/CreateUserUseCase.js";
import CreateUserController from "../../../presentation/controllers/CreateUserController.js";
import prismaClient from "../../../infra/db/prisma/PrismaClient.js";
import bcrypt from "bcrypt";

import Envs from "../../../main/config/env.js";

export const makeCreateUserController = () => {
    const envs = new Envs();
    const userRepository = new UserRepository({ db: prismaClient });
    const hashProvider = new BcryptHashProvider({ bcrypt, envs });

    const createUserUseCase = new CreateUserUseCase({
        userRepository,
        hashProvider
    });

    const createUserController = new CreateUserController({
        createUserUseCase
    });

    return createUserController;
};
