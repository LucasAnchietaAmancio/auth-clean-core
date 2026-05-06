import UserRepository from "../../infrastructure/persistence/repositories/UserRepository.js";
import BcryptHashProvider from "../../infrastructure/security/providers/BcryptHashProvider.js";
import LoginController from "../../presentation/controllers/LoginController.js";
import LoginUseCase from "../../application/use-cases/auth/LoginUseCase.js";
import JwtTokenProvider from "../../infrastructure/security/providers/JwtTokenProvider.js";
import jwt from "jsonwebtoken";
import prismaClient from "../../infrastructure/persistence/prisma/PrismaClient.js";
import bcrypt from "bcrypt";

export const makeLoginController = () => {
    const userRepository = new UserRepository({ db: prismaClient });
    const hashProvider = new BcryptHashProvider({ bcrypt });
    const tokenProvider = new JwtTokenProvider({ jwt });

    const loginUseCase = new LoginUseCase({
        userRepository,
        hashProvider,
        tokenProvider,
    });

    const loginController = new LoginController({
        loginUseCase
    });

    return loginController;
};