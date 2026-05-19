import { describe, jest, test, expect } from "@jest/globals";
import SessionTokenService from "../../../src/application/services/SessionTokenService.js";
import SessionEntity from "../../../src/domain/entities/SessionEntity.js";

describe("Testes de Serviço: SessionTokenService", () => {
    const tokenProviderMock = {
        generateAccessToken: jest.fn(),
        generateRefreshToken: jest.fn(),
        decodeToken: jest.fn(),
    };

    const hashProviderMock = {
        hash: jest.fn(),
    };

    const sessionRepositoryMock = {
        save: jest.fn(),
        update: jest.fn(),
    };

    const envsMock = {
        jwt: {
            accessTokenExpiresIn: "15m",
            refreshTokenExpiresIn: "7d",
        },
    };

    const sut = new SessionTokenService({
        tokenProvider: tokenProviderMock,
        hashProvider: hashProviderMock,
        sessionRepository: sessionRepositoryMock,
        envs: envsMock,
    });

    describe("Validação do método 'generateSessionTokens':", () => {
        test("Deve gerar tokens de acesso e atualização e persistir a sessão", async () => {
            tokenProviderMock.generateAccessToken.mockResolvedValue("access-token-valido");
            tokenProviderMock.generateRefreshToken.mockResolvedValue("refresh-token-valido");
            tokenProviderMock.decodeToken.mockResolvedValue({
                jti: "jti-mock",
                exp: 1234567890,
            });
            hashProviderMock.hash.mockResolvedValue("hashed-refresh-token");
            sessionRepositoryMock.save.mockResolvedValue();

            const result = await sut.generateSessionTokens({
                userId: 1,
                email: "test@email.com",
            });

            expect(result.accessToken).toBe("access-token-valido");
            expect(result.refreshToken).toBe("refresh-token-valido");
            expect(tokenProviderMock.generateAccessToken).toHaveBeenCalledWith({
                payload: { id: 1, email: "test@email.com" },
                expires: "15m",
            });
            expect(tokenProviderMock.generateRefreshToken).toHaveBeenCalledWith({
                payload: { id: 1, email: "test@email.com" },
                expires: "7d",
            });
            expect(hashProviderMock.hash).toHaveBeenCalledWith({ value: "refresh-token-valido" });
            expect(sessionRepositoryMock.save).toHaveBeenCalled();
        });
    });

    describe("Validação do método 'rotateSessionTokens':", () => {
        test("Deve rotacionar a sessão atualizando a entidade com novos valores e persistir no banco", async () => {
            const currentSession = SessionEntity.restore({
                id: 100,
                userId: 1,
                token: "old-token-hash",
                jti: "old-jti",
                expiresAt: 99999,
            });

            tokenProviderMock.generateAccessToken.mockResolvedValue("new-access-token");
            tokenProviderMock.generateRefreshToken.mockResolvedValue("new-refresh-token");
            tokenProviderMock.decodeToken.mockResolvedValue({
                jti: "new-jti-mock",
                exp: 99999999,
            });
            hashProviderMock.hash.mockResolvedValue("new-hashed-refresh-token");
            sessionRepositoryMock.update.mockResolvedValue();

            const result = await sut.rotateSessionTokens({
                userId: 1,
                email: "test@email.com",
                currentSessionEntity: currentSession,
            });

            expect(result.accessToken).toBe("new-access-token");
            expect(result.refreshToken).toBe("new-refresh-token");
            expect(currentSession.token).toBe("new-hashed-refresh-token");
            expect(currentSession.jti).toBe("new-jti-mock");
            expect(currentSession.expiresAt).toBe(99999999);
            expect(sessionRepositoryMock.update).toHaveBeenCalledWith({
                sessionEntity: currentSession,
            });
        });
    });
});
