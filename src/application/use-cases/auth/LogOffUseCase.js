import InvalidTokenError from "../../errors/InvalidTokenError.js";

export default class LogOffUseCase {
    constructor({ sessionRepository, tokenProvider }) {
        this.sessionRepository = sessionRepository;
        this.tokenProvider = tokenProvider;
    }

    async execute({ refreshToken }) {

        await this.tokenProvider.verifyRefreshToken({ refreshToken });

        const decoded = await this.tokenProvider.decodeToken({ token: refreshToken });

        if (!decoded || !decoded.jti) {
            throw new InvalidTokenError({ originalError: "Token de atualização inválido, para realizer o logoff" });
        }

        const session = await this.sessionRepository.findByJti({ jti: decoded.jti });

        if (!session) {
            throw new InvalidTokenError({ originalError: "Sessão não encontrada ou revogada, não foi possível completar o logoff" });
        }

        await this.sessionRepository.deleteByJti({ jti: decoded.jti });
    }
}