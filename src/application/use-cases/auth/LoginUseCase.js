import InvalidCredentialsError from "../../errors/InvalidCredentialsError.js";
import LoginResponseDTO from "../../dtos/auth/LoginResponseDTO.js";

export default class LoginUseCase {
    constructor({ userRepository, hashProvider, sessionTokenService, tokenProvider, sessionRepository }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.sessionTokenService = sessionTokenService;
        this.tokenProvider = tokenProvider;
        this.sessionRepository = sessionRepository;
    }

    async execute({ loginRequestDTO }) {
        const user = await this.userRepository.findByEmail({ email: loginRequestDTO.email });

        if (!user) throw new InvalidCredentialsError({ originalError: "Usuário não encontrado" });

        const passwordMatch = await this.hashProvider.compare({ value: loginRequestDTO.password, hash: user.password.value });

        if (!passwordMatch) throw new InvalidCredentialsError({ originalError: "Senha inválida" });

        const { accessToken, refreshToken } = await this.sessionTokenService.generateSessionTokens({
            userId: user.id,
            email: user.email.value
        });

        return new LoginResponseDTO({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name.value
            }
        });
    }
}
