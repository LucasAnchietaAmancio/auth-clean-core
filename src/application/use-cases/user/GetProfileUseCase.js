
import GetProfileResponseDTO from "./dtos/GetProfileResponseDTO.js";
import UserNotFoundError from "../../errors/UserNotFound.js";

export default class GetProfileUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    };

    async execute({ getProfileRequestDTO }) {

        const user = await this.userRepository.findByIdUser({ idUser: getProfileRequestDTO.idUser });

        if (!user) throw new UserNotFoundError({ originalError: "Usuário não encontrado, verifique se o idUser é válido" });

        return new GetProfileResponseDTO({
            idUser: user.idUser,
            name: user.name,
            email: user.email
        });
    };
};  