import ApplicationErrors from "../../errors/ApplicationErrors.js";
import LoginResponseDTO from "../../dtos/auth/LoginResponseDTO.js";
import RefreshTokenEntity from "../../../domain/entities/RefreshTokenEntity.js";

export default class LoginUseCase {
    constructor({ userRepository, hashProvider, tokenProvider, refreshTokenRepository, envs }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenProvider = tokenProvider;
        this.envs = envs;
    }

    async execute({ loginRequestDTO }) {
        if (!loginRequestDTO.email || !loginRequestDTO.password) {
            throw ApplicationErrors.badRequest({
                message: "E-mail e senha são obrigatórios",
                description: "Por favor, insira um e-mail e senha para fazer login."
            });
        };

        const user = await this.userRepository.findAuthByEmail({ email: loginRequestDTO.email });

        if (!user) {
            throw ApplicationErrors.unauthorized({
                message: "Credenciais inválidas",
                description: "Email ou senha incorretos."
            });
        };

        const passwordMatch = await this.hashProvider.compare({
            value: loginRequestDTO.password,
            hash: user.password.value
        });

        if (!passwordMatch) {
            throw ApplicationErrors.unauthorized({
                message: "Credenciais inválidas",
                description: "Email ou senha incorretos."
            });
        };

        const accessToken = await this.tokenProvider.generateToken({
            payload: {
                id: user.id,
                email: user.email.value
            },
            expires: this.envs.jwt.accessTokenExpiresIn
        });

        const refreshTokenValue = await this.tokenProvider.generateToken({
            payload: { id: user.id, email: user.email.value },
            expires: this.envs.jwt.refreshTokenExpiresIn
        });

        const decoded = await this.tokenProvider.decodeToken({
            token: refreshTokenValue
        });

        const refreshTokenEntity = new RefreshTokenEntity({
            userId: user.id,
            token: refreshTokenValue,
            jti: decoded.jti,
            expiresAt: decoded.exp
        });

        await this.refreshTokenRepository.create({
            refreshTokenEntity: refreshTokenEntity
        });

        return new LoginResponseDTO({
            accessToken: accessToken,
            refreshToken: refreshTokenEntity.token,
            user: {
                id: user.id,
                name: user.name.value,
                email: user.email.value
            }
        });
    }
}
