import SessionTokenService from "../../../application/services/SessionTokenService.js";
import { makeHashProvider } from "../providers/makeHashProvider.js";
import { makeTokenProvider } from "../providers/makeTokenProvider.js";
import { makeSessionRepository } from "../repositories/makeSessionRepository.js";

export const makeSessionTokenService = ({ envs, db }) => {
    return new SessionTokenService({
        tokenProvider: makeTokenProvider({ envs }),
        hashProvider: makeHashProvider({ envs }),
        sessionRepository: makeSessionRepository({ db }),
        envs
    });
};
