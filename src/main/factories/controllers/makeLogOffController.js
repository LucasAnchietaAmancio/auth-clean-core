import LogOffUseCase from "../../../application/use-cases/auth/LogOffUseCase.js";
import LogOffController from "../../../presentation/controllers/auth/LogOffController.js";
import { makeSessionRepository } from "../repositories/makeSessionRepository.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";

export const makeLogOffController = ({ envs, db }) => {
    const logOffUseCase = new LogOffUseCase({
        sessionRepository: makeSessionRepository({ db }),
        tokenProvider: makeTokenProvider({ envs })
    });

    return new LogOffController({
        logOffUseCase,
    });
};
