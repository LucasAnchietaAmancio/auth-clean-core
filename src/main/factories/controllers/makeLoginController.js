import UserRepository from "../../../infra/db/repositories/UserRepository.js";
import BcryptHashProvider from "../../../infra/providers/hash/BcryptHashProvider.js";
import JwtTokenProvider from "../../../infra/providers/token/JwtTokenProvider.js";
import RefreshTokenRepository from "../../../infra/db/repositories/RefreshTokenRepository.js";
import LoginUseCase from "../../../application/use-cases/auth/LoginUseCase.js";
import LoginController from "../../../presentation/controllers/auth/LoginController.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const makeLoginController = ({ envs, db }) => {
    const userRepository = new UserRepository({ db });
    const hashProvider = new BcryptHashProvider({ bcrypt, envs });
    const tokenProvider = new JwtTokenProvider({ jwt, crypto, envs });
    const refreshTokenRepository = new RefreshTokenRepository({ db });

    const loginUseCase = new LoginUseCase({
        userRepository,
        hashProvider,
        tokenProvider,
        refreshTokenRepository,
        envs
    });

    return new LoginController({ loginUseCase });
};