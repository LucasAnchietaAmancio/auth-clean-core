import InvalidCredentialsError from "../../errors/InvalidCredentialsError.js";
import LoginResponseDTO from "../../dtos/auth/LoginResponseDTO.js";
import RefreshTokenEntity from "../../../domain/entities/RefreshTokenEntity.js";
import InternalApplicationError from "../../errors/InternalApplicationError.js";

export default class LoginUseCase {
    constructor({ userRepository, hashProvider, tokenProvider, refreshTokenRepository, envs }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenProvider = tokenProvider;
        this.envs = envs;
    }

    async execute({ loginRequestDTO }) {
        const user = await this.userRepository.findAuthByEmail({ email: loginRequestDTO.email });

        if (!user) throw new InvalidCredentialsError({ originalError: "Usuário não encontrado" });

        const passwordMatch = await this.hashProvider.compare({
            value: loginRequestDTO.password,
            hash: user.password.value
        });

        if (!passwordMatch) throw new InvalidCredentialsError({ originalError: "Senha inválida" });

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

        const refreshTokenSaved = await this.refreshTokenRepository.create({
            refreshTokenEntity: refreshTokenEntity
        });

        if (!refreshTokenSaved) {
            throw new InternalApplicationError({ originalError: "Falha no armazenamento do refresh token" });
        }

        return new LoginResponseDTO({
            accessToken: accessToken,
            refreshToken: refreshTokenEntity.token,
            user: {
                id: user.id,
                name: user.name.value
            }
        });
    }
}
