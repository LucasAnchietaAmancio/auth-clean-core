import InvalidCredentialsError from "../../errors/InvalidCredentialsError.js";
import LoginResponseDTO from "./dtos/LoginResponseDTO.js";

export default class LoginUseCase {
    constructor({ userRepository, hashProvider, sessionTokenService }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.sessionTokenService = sessionTokenService;
    }

    async execute({ loginRequestDTO }) {

        const user = await this.userRepository.findByEmail({ email: loginRequestDTO.email });

        if (!user) throw new InvalidCredentialsError({ originalError: "Usuário não encontrado" });

        const passwordMatch = await this.hashProvider.compare({ value: loginRequestDTO.password, hash: user.password.value });

        if (!passwordMatch) throw new InvalidCredentialsError({ originalError: "Senha inválida" });

        const { accessToken, refreshToken } = await this.sessionTokenService.generateSessionTokens({
            idUser: user.idUser,
            email: user.email.value
        });

        return new LoginResponseDTO({
            accessToken,
            refreshToken,
            user: {
                idUser: user.idUser,
                name: user.name.value
            }
        });
    }
}
