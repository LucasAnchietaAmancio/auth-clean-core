import CreateUserUseCase from "../../../application/use-cases/user/CreateUserUseCase.js";
import CreateUserController from "../../../presentation/controllers/user/CreateUserController.js";
import { makeHashProvider } from "../providers/makeHashProvider.js";
import { makeUserRepository } from "../repositories/makeUserRepository.js";

export const makeCreateUserController = ({ envs, db }) => {
    const createUserUseCase = new CreateUserUseCase({
        userRepository: makeUserRepository({ db }),
        hashProvider: makeHashProvider({ envs })
    });

    return new CreateUserController({ createUserUseCase });
};
