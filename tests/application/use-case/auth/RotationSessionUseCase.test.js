import { describe, jest, test, expect } from "@jest/globals";
import RotationSessionUseCase from "../../../../src/application/use-cases/auth/RotationSessionUseCase.js";
import RotationSessionRequestDTO from "../../../../src/application/dtos/auth/RotationSessionRequestDTO.js";
import RotationSessionResponseDTO from "../../../../src/application/dtos/auth/RotationSessionResponseDTO.js";
import InvalidTokenError from "../../../../src/application/errors/InvalidTokenError.js";
import SessionEntity from "../../../../src/domain/entities/SessionEntity.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";

describe("Testes de Aplicação: RotationSessionUseCase", () => {
    const tokenProviderMock = {
        verifyRefreshToken: jest.fn(),
    };

    const sessionRepositoryMock = {
        findByJti: jest.fn(),
        deleteAllByUserId: jest.fn(),
    };

    const hashProviderMock = {
        compare: jest.fn(),
    };

    const userRepositoryMock = {
        findByEmail: jest.fn(),
    };

    const sessionTokenServiceMock = {
        rotateSessionTokens: jest.fn(),
    };

    const sut = new RotationSessionUseCase({
        hashProvider: hashProviderMock,
        tokenProvider: tokenProviderMock,
        sessionRepository: sessionRepositoryMock,
        userRepository: userRepositoryMock,
        sessionTokenService: sessionTokenServiceMock,
    });

    const mockSession = SessionEntity.restore({
        id: 100,
        userId: 1,
        token: "hashed-token",
        jti: "jti-valido",
        expiresAt: 9999999,
    });

    const mockUser = UserEntity.restore({
        id: 1,
        name: "Lucas Anchieta",
        email: "lucas@email.com",
        hashedPassword: "hashed-password",
    });

    describe("Validação do fluxo de rotação de sessão:", () => {
        test("Deve rotacionar a sessão com sucesso e retornar novos tokens", async () => {
            tokenProviderMock.verifyRefreshToken.mockResolvedValue({
                id: 1,
                email: "lucas@email.com",
                jti: "jti-valido",
            });
            sessionRepositoryMock.findByJti.mockResolvedValue(mockSession);
            hashProviderMock.compare.mockResolvedValue(true);
            userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
            sessionTokenServiceMock.rotateSessionTokens.mockResolvedValue({
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
            });

            const request = new RotationSessionRequestDTO({ refreshToken: "raw-refresh-token" });
            const result = await sut.execute({ rotationSessionRequestDTO: request });

            expect(result).toBeInstanceOf(RotationSessionResponseDTO);
            expect(result.accessToken).toBe("new-access-token");
            expect(result.refreshToken).toBe("new-refresh-token");
            expect(tokenProviderMock.verifyRefreshToken).toHaveBeenCalledWith({ refreshToken: "raw-refresh-token" });
            expect(sessionRepositoryMock.findByJti).toHaveBeenCalledWith({ jti: "jti-valido" });
            expect(hashProviderMock.compare).toHaveBeenCalledWith({ value: "raw-refresh-token", hash: "hashed-token" });
            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith({ email: "lucas@email.com" });
            expect(sessionTokenServiceMock.rotateSessionTokens).toHaveBeenCalledWith({
                userId: 1,
                email: "lucas@email.com",
                currentSessionEntity: mockSession,
            });
        });

        test("Deve lançar erro original quando a validação do token falhar", async () => {
            const error = new Error("Token expirado");
            tokenProviderMock.verifyRefreshToken.mockRejectedValue(error);

            const request = new RotationSessionRequestDTO({ refreshToken: "raw-refresh-token" });

            await expect(sut.execute({ rotationSessionRequestDTO: request }))
                .rejects.toThrow(error);
        });

        test("Deve lançar InvalidTokenError se o token decodificado não tiver jti", async () => {
            tokenProviderMock.verifyRefreshToken.mockResolvedValue({
                id: 1,
                email: "lucas@email.com",
                // jti ausente
            });

            const request = new RotationSessionRequestDTO({ refreshToken: "raw-refresh-token" });

            await expect(sut.execute({ rotationSessionRequestDTO: request }))
                .rejects.toThrow(InvalidTokenError);
        });

        test("Deve deletar todas as sessões do usuário e lançar InvalidTokenError se a sessão não for encontrada no banco (Detecção de Reuso)", async () => {
            tokenProviderMock.verifyRefreshToken.mockResolvedValue({
                id: 1,
                email: "lucas@email.com",
                jti: "jti-revogado",
            });
            sessionRepositoryMock.findByJti.mockResolvedValue(null);
            sessionRepositoryMock.deleteAllByUserId.mockResolvedValue();

            const request = new RotationSessionRequestDTO({ refreshToken: "raw-refresh-token" });

            await expect(sut.execute({ rotationSessionRequestDTO: request }))
                .rejects.toThrow(InvalidTokenError);

            expect(sessionRepositoryMock.deleteAllByUserId).toHaveBeenCalledWith({ userId: 1 });
        });

        test("Deve lançar InvalidTokenError se a sessão existe mas o token não bate com o hash", async () => {
            tokenProviderMock.verifyRefreshToken.mockResolvedValue({
                id: 1,
                email: "lucas@email.com",
                jti: "jti-valido",
            });
            sessionRepositoryMock.findByJti.mockResolvedValue(mockSession);
            hashProviderMock.compare.mockResolvedValue(false);

            const request = new RotationSessionRequestDTO({ refreshToken: "raw-refresh-token" });

            await expect(sut.execute({ rotationSessionRequestDTO: request }))
                .rejects.toThrow(InvalidTokenError);
        });

        test("Deve lançar InvalidTokenError se o usuário não for encontrado", async () => {
            tokenProviderMock.verifyRefreshToken.mockResolvedValue({
                id: 1,
                email: "lucas@email.com",
                jti: "jti-valido",
            });
            sessionRepositoryMock.findByJti.mockResolvedValue(mockSession);
            hashProviderMock.compare.mockResolvedValue(true);
            userRepositoryMock.findByEmail.mockResolvedValue(null);

            const request = new RotationSessionRequestDTO({ refreshToken: "raw-refresh-token" });

            await expect(sut.execute({ rotationSessionRequestDTO: request }))
                .rejects.toThrow(InvalidTokenError);
        });
    });
});
