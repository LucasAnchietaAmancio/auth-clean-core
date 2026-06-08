import InvalidTokenError from "../../errors/InvalidTokenError.js";

export default class LogoutUseCase {
    constructor({ sessionRepository, tokenProvider, cacheProvider }) {
        this.sessionRepository = sessionRepository;
        this.tokenProvider = tokenProvider;
        this.cacheProvider = cacheProvider;
    }

    async execute({ refreshToken, accessToken }) {
        const decoded = await this.tokenProvider.verifyRefreshToken({ refreshToken });

        if (!decoded || !decoded.jti) {
            throw new InvalidTokenError({ originalError: "Token de atualização inválido, para realizer o logoff" });
        }

        const session = await this.sessionRepository.findByJti({ jti: decoded.jti });

        if (!session) {
            throw new InvalidTokenError({ originalError: "Sessão não encontrada ou revogada, não foi possível completar o logoff" });
        }

        const decodedAccessToken = await this.tokenProvider.verifyAccessToken({ accessToken });

        if (!decodedAccessToken || !decodedAccessToken.jti || !decodedAccessToken.exp) {
            throw new InvalidTokenError({ originalError: "Token de acesso inválido, não foi possível completar o logoff" });
        }

        await this.cacheProvider.set({
            key: `auth:blacklist:${decodedAccessToken.jti}`,
            value: "revoked",
            expiresIn: Math.max(decodedAccessToken.exp - Math.floor(Date.now() / 1000), 1)
        });

        await this.sessionRepository.deleteByJti({ jti: decoded.jti });
    }
}
