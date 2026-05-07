import UserRepository from "../../../infra/db/repositories/UserRepository.js";
import BcryptHashProvider from "../../../infra/providers/hash/BcryptHashProvider.js";
import LoginController from "../../../presentation/controllers/auth/LoginController.js";
import LoginUseCase from "../../../application/use-cases/auth/LoginUseCase.js";
import JwtTokenProvider from "../../../infra/providers/token/JwtTokenProvider.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prismaClient from "../../../infra/db/prisma/PrismaClient.js";
import bcrypt from "bcrypt";
import RefreshTokenRepository from "../../../infra/db/repositories/RefreshTokenRepository.js";
import Envs from "../../../main/config/env.js";

export const makeLoginController = () => {
    const envs = new Envs();
    const userRepository = new UserRepository({ db: prismaClient });
    const hashProvider = new BcryptHashProvider({ bcrypt, envs });
    const refreshTokenRepository = new RefreshTokenRepository({ db: prismaClient });
    const tokenProvider = new JwtTokenProvider({ jwt, crypto, envs });

    const loginUseCase = new LoginUseCase({
        userRepository,
        hashProvider,
        tokenProvider,
        refreshTokenRepository,
        envs
    });

    const loginController = new LoginController({
        loginUseCase
    });

    return loginController;
};