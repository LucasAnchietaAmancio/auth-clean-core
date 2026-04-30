import ApplicationErrors from "../../errors/ApplicationErrors.js"; // Adicionado .js
import LoginResponseDTO from "../../dtos/auth/LoginResponseDTO.js";

export default class LoginUseCase {
    constructor({ userRepository, hashProvider, tokenProvider }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.tokenProvider = tokenProvider;
    }

    async execute({ loginRequestDTO }) {
        if (!loginRequestDTO.email || !loginRequestDTO.password) {
            throw ApplicationErrors.badRequest({
                message: "E-mail e senha são obrigatórios",
                description: "Por favor, insira um e-mail e senha para fazer login."
            });
        };

        const user = await this.userRepository.findByEmail({ email: loginRequestDTO.email });

        const passwordMatch = await this.hashProvider.compare({
            value: loginRequestDTO.password,
            hash: user ? user.password.value : ""
        });

        if (!user || !passwordMatch) {
            throw ApplicationErrors.unauthorized({
                message: "Credenciais inválidas",
                description: "Email ou senha incorretos."
            });
        };

        const token = await this.tokenProvider.generateToken({
            payload: {
                id: user.id,
                email: user.email.value
            }
        });

        return new LoginResponseDTO({
            token,
            user: {
                id: user.id,
                name: user.name.value,
                email: user.email.value
            }
        });
    }
}
