import UserRepository from "../../../infra/db/repositories/UserRepository.js";
import BcryptHashProvider from "../../../infra/providers/hash/BcryptHashProvider.js";
import JwtTokenProvider from "../../../infra/providers/token/JwtTokenProvider.js";
import SessionRepository from "../../../infra/db/repositories/SessionRepository.js";
import RotationSessionUseCase from "../../../application/use-cases/auth/RotationSessionUseCase.js";
import RotationSessionController from "../../../presentation/controllers/auth/RotationSessionController.js";
import SessionTokenService from "../../../application/services/SessionTokenService.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const makeRotationSessionController = ({ envs, db }) => {
    const userRepository = new UserRepository({ db });
    const hashProvider = new BcryptHashProvider({ bcrypt, envs });
    const tokenProvider = new JwtTokenProvider({ jwt, crypto, envs });
    const sessionRepository = new SessionRepository({ db });
    const sessionTokenService = new SessionTokenService({
        tokenProvider,
        hashProvider,
        sessionRepository,
        envs
    });


    const rotationSessionUseCase = new RotationSessionUseCase({
        hashProvider,
        tokenProvider,
        sessionRepository,
        userRepository,
        sessionTokenService
    });

    return new RotationSessionController({ rotationSessionUseCase, envs });
};