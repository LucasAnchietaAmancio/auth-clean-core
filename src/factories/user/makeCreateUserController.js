import UserRepository from "../../infrastructure/persistence/repositories/UserRepository.js";
import BcryptHashProvider from "../../infrastructure/security/providers/BcryptHashProvider.js";
import CreateUserUseCase from "../../application/use-cases/user/CreateUserUseCase.js";
import CreateUserController from "../../presentation/controllers/CreateUserController.js";
import prismaClient from "../../infrastructure/persistence/prisma/PrismaClient.js";
import bcrypt from "bcrypt";

export const makeCreateUserController = () => {
    const userRepository = new UserRepository({ db: prismaClient });
    const hashProvider = new BcryptHashProvider({ bcrypt });

    const createUserUseCase = new CreateUserUseCase({
        userRepository,
        hashProvider
    });

    const createUserController = new CreateUserController({
        createUserUseCase
    });

    return createUserController;
};
