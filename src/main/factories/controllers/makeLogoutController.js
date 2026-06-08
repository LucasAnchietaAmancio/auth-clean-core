import LogoutUseCase from "../../../application/use-cases/auth/LogoutUseCase.js";
import LogoutController from "../../../presentation/controllers/auth/LogoutController.js";
import RedisCacheProvider from "../../../infra/providers/cache/RedisCacheProvider.js";
import { makeSessionRepository } from "../repositories/makeSessionRepository.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";

export const makeLogoutController = ({ envs, db, redisClient }) => {
    const logoutUseCase = new LogoutUseCase({
        sessionRepository: makeSessionRepository({ db }),
        tokenProvider: makeTokenProvider({ envs }),
        cacheProvider: new RedisCacheProvider({ redis: redisClient })
    });

    return new LogoutController({
        logoutUseCase,
    });
};
