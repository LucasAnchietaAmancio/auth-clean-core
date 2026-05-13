import UserRepository from "../../../infra/db/repositories/UserRepository.js";
import BcryptHashProvider from "../../../infra/providers/hash/BcryptHashProvider.js";
import CreateUserUseCase from "../../../application/use-cases/user/CreateUserUseCase.js";
import CreateUserController from "../../../presentation/controllers/user/CreateUserController.js";
import { PrismaClient } from "@prisma/client";
import PrismaClientWrapper from "../../../infra/db/prisma/PrismaClient.js";
import bcrypt from "bcrypt";
import Envs from "../../../main/config/env.js";

export const makeCreateUserController = () => {
    const envs = new Envs();

    const prismaClientInstance = new PrismaClientWrapper({ prismaClient: PrismaClient, envs });

    const userRepository = new UserRepository({ db: prismaClientInstance });

    const hashProvider = new BcryptHashProvider({ bcrypt, envs });

    const createUserUseCase = new CreateUserUseCase({ userRepository, hashProvider });

    const createUserController = new CreateUserController({ createUserUseCase });

    return createUserController;
};
