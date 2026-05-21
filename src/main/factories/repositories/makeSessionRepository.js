import SessionRepository from "../../../infra/db/repositories/SessionRepository.js";

export const makeSessionRepository = ({ db }) => {
    return new SessionRepository({ db });
};
