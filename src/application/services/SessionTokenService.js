import SessionEntity from "../../domain/entities/SessionEntity.js";

export default class SessionTokenService {
    constructor({ tokenProvider, hashProvider, sessionRepository, envs }) {
        this.tokenProvider = tokenProvider;
        this.hashProvider = hashProvider;
        this.sessionRepository = sessionRepository;
        this.envs = envs;
    }

    async generateSessionTokens({ userId, email }) {
        const accessToken = await this.tokenProvider.generateAccessToken({
            payload: { id: userId, email },
            expires: this.envs.jwt.accessTokenExpiresIn
        });

        const refreshTokenValue = await this.tokenProvider.generateRefreshToken({
            payload: { id: userId, email },
            expires: this.envs.jwt.refreshTokenExpiresIn
        });

        const decoded = await this.tokenProvider.decodeToken({ token: refreshTokenValue });
        const hashedRefreshToken = await this.hashProvider.hash({ value: refreshTokenValue });

        const sessionEntity = SessionEntity.create({
            userId,
            token: hashedRefreshToken,
            jti: decoded.jti,
            expiresAt: decoded.exp
        });

        await this.sessionRepository.save({ sessionEntity });

        return { accessToken, refreshToken: refreshTokenValue };
    }

    async rotateSessionTokens({ userId, email, currentSessionEntity }) {
        const accessToken = await this.tokenProvider.generateAccessToken({
            payload: { id: userId, email },
            expires: this.envs.jwt.accessTokenExpiresIn
        });

        const refreshTokenValue = await this.tokenProvider.generateRefreshToken({
            payload: { id: userId, email },
            expires: this.envs.jwt.refreshTokenExpiresIn
        });

        const decoded = await this.tokenProvider.decodeToken({ token: refreshTokenValue });
        const hashedRefreshToken = await this.hashProvider.hash({ value: refreshTokenValue });

        currentSessionEntity.updateSessionData({
            newTokenHash: hashedRefreshToken,
            newJti: decoded.jti,
            newExpiresAt: decoded.exp
        });

        await this.sessionRepository.update({
            sessionEntity: currentSessionEntity
        });

        return { accessToken, refreshToken: refreshTokenValue };
    }
}
