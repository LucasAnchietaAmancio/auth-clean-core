import RotationSessionUseCase from "../../../application/use-cases/auth/RotationSessionUseCase.js";
import RotationSessionController from "../../../presentation/controllers/auth/RotationSessionController.js";
import { makeHashProvider } from "../providers/makeHashProvider.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";
import { makeSessionRepository } from "../repositories/makeSessionRepository.js";
import { makeUserRepository } from "../repositories/makeUserRepository.js";
import { makeSessionTokenService } from "../services/makeSessionTokenService.js";

export const makeRotationSessionController = ({ envs, db }) => {
    const rotationSessionUseCase = new RotationSessionUseCase({
        hashProvider: makeHashProvider({ envs }),
        tokenProvider: makeTokenProvider({ envs }),
        sessionRepository: makeSessionRepository({ db }),
        userRepository: makeUserRepository({ db }),
        sessionTokenService: makeSessionTokenService({ envs, db })
    });

    return new RotationSessionController({ rotationSessionUseCase, envs });
};
