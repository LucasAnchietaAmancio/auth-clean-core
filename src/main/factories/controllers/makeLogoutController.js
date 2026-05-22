import LogoutUseCase from "../../../application/use-cases/auth/LogoutUseCase.js";
import LogoutController from "../../../presentation/controllers/auth/LogoutController.js";
import { makeSessionRepository } from "../repositories/makeSessionRepository.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";

export const makeLogoutController = ({ envs, db }) => {
    const logoutUseCase = new LogoutUseCase({
        sessionRepository: makeSessionRepository({ db }),
        tokenProvider: makeTokenProvider({ envs })
    });

    return new LogoutController({
        logoutUseCase,
    });
};
