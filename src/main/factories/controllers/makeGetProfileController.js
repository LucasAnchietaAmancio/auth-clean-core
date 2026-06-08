import GetProfileUseCase from "../../../application/use-cases/user/GetProfileUseCase.js";
import GetProfileController from "../../../presentation/controllers/user/GetProfileController.js";
import { makeValidatorProvider } from "../providers/makeValidatorProvider.js";
import { makeUserRepository } from "../repositories/makeUserRepository.js";

export const makeGetProfileController = ({ db }) => {
    const getProfileUseCase = new GetProfileUseCase({
        userRepository: makeUserRepository({ db })
    });

    return new GetProfileController({
        getProfileUseCase,
        validatorProvider: makeValidatorProvider()
    });
};
