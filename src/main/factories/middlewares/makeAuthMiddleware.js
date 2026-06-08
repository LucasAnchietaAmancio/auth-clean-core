import AuthMiddleware from "../../../presentation/middlewares/auth/AuthMiddleware.js";
import RedisCacheProvider from "../../../infra/providers/cache/RedisCacheProvider.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";
import { makeUserRepository } from "../repositories/makeUserRepository.js";

export const makeAuthMiddleware = ({ envs, db, redisClient }) => {
    return new AuthMiddleware({
        tokenProvider: makeTokenProvider({ envs }),
        userRepository: makeUserRepository({ db }),
        cacheProvider: new RedisCacheProvider({ redis: redisClient })
    });
};
