import RotationSessionResponseDTO from "../../dtos/auth/RotationSessionResponseDTO.js";
import InvalidTokenError from "../../errors/InvalidTokenError.js";

export default class RotationSessionUseCase {
    constructor({ hashProvider, tokenProvider, sessionRepository, userRepository, sessionTokenService }) {
        this.hashProvider = hashProvider;
        this.tokenProvider = tokenProvider;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.sessionTokenService = sessionTokenService;
    }

    async execute({ rotationSessionRequestDTO }) {
        const { refreshToken } = rotationSessionRequestDTO;

        const decoded = await this.tokenProvider.verifyRefreshToken({ refreshToken });

        if (!decoded || !decoded.jti) {
            throw new InvalidTokenError({ originalError: "Token de atualização inválido." });
        }

        const session = await this.sessionRepository.findByJti({ jti: decoded.jti });

        if (!session) {
            if (decoded.id) {
                await this.sessionRepository.deleteAllByUserId({ userId: decoded.id });
            }
            throw new InvalidTokenError({ originalError: "Sessão não encontrada ou revogada. Possível reuso de token detectado. Todas as sessões foram encerradas por segurança." });
        }
 
        const tokenMatch = await this.hashProvider.compare({
            value: refreshToken,
            hash: session.token
        });

        if (!tokenMatch) {
            throw new InvalidTokenError({
                originalError: "Credenciais de sessão inválidas."
            });
        }

        const user = await this.userRepository.findByEmail({ email: decoded.email });
        
        if (!user) {
            throw new InvalidTokenError({ originalError: "Usuário não encontrado." });
        }

        const { accessToken, refreshToken: newRefreshToken } = await this.sessionTokenService.rotateSessionTokens({
            userId: user.id,
            email: user.email.value,
            currentSessionEntity: session
        });

        return new RotationSessionResponseDTO({
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                name: user.name.value
            }
        });
    }
}
