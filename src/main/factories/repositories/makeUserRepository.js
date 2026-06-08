import UserRepository from "../../../infra/db/repositories/UserRepository.js";

export const makeUserRepository = ({ db }) => {
    return new UserRepository({ db });
};
