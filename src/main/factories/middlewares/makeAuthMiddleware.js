import AuthMiddleware from "../../../presentation/middlewares/auth/AuthMiddleware.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";
import { makeUserRepository } from "../repositories/makeUserRepository.js";

export const makeAuthMiddleware = ({ envs, db }) => {
    return new AuthMiddleware({
        tokenProvider: makeTokenProvider({ envs }),
        userRepository: makeUserRepository({ db })
    });
};
