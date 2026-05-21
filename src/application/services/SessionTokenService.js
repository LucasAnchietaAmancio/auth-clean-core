import SessionEntity from "../../domain/entities/SessionEntity.js";

export default class SessionTokenService {
    constructor({ tokenProvider, hashProvider, sessionRepository, envs }) {
        this.tokenProvider = tokenProvider;
        this.hashProvider = hashProvider;
        this.sessionRepository = sessionRepository;
        this.envs = envs;
    }

    async generateSessionTokens({ idUser, email }) {

        const accessToken = await this.tokenProvider.generateAccessToken({ payload: { idUser: idUser, email }, expires: this.envs.jwt.accessTokenExpiresIn} );

        const refreshTokenValue = await this.tokenProvider.generateRefreshToken({ payload: { idUser: idUser, email }, expires: this.envs.jwt.refreshTokenExpiresIn });

        const decoded = await this.tokenProvider.decodeToken({ token: refreshTokenValue });
        const hashedRefreshToken = await this.hashProvider.hash({ value: refreshTokenValue });

        const sessionEntity = SessionEntity.create({
            idUser,
            token: hashedRefreshToken,
            jti: decoded.jti,
            expiresAt: decoded.exp
        });

        await this.sessionRepository.save({ sessionEntity });

        return { accessToken, refreshToken: refreshTokenValue };
    }

    async rotateSessionTokens({ idUser, email, currentSessionEntity }) {

        const accessToken = await this.tokenProvider.generateAccessToken({ payload: { idUser: idUser, email }, expires: this.envs.jwt.accessTokenExpiresIn });

        const refreshToken = await this.tokenProvider.generateRefreshToken({ payload: { idUser: idUser, email }, expires: this.envs.jwt.refreshTokenExpiresIn });

        const decoded = await this.tokenProvider.decodeToken({ token: refreshToken });
        const hashedRefreshToken = await this.hashProvider.hash({ value: refreshToken });

        currentSessionEntity.updateSessionData({ newTokenHash: hashedRefreshToken, newJti: decoded.jti, newExpiresAt: decoded.exp });

        await this.sessionRepository.update({ sessionEntity: currentSessionEntity });

        return { accessToken, refreshToken };
    }
}
