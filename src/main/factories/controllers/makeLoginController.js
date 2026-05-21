import LoginUseCase from "../../../application/use-cases/auth/LoginUseCase.js";
import LoginController from "../../../presentation/controllers/auth/LoginController.js";
import { makeHashProvider } from "../providers/makeHashProvider.js";
import { makeUserRepository } from "../repositories/makeUserRepository.js";
import { makeSessionTokenService } from "../services/makeSessionTokenService.js";

export const makeLoginController = ({ envs, db }) => {
    const loginUseCase = new LoginUseCase({
        userRepository: makeUserRepository({ db }),
        hashProvider: makeHashProvider({ envs }),
        sessionTokenService: makeSessionTokenService({ envs, db })
    });

    return new LoginController({ loginUseCase, envs });
};
