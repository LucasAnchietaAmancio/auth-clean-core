import { describe, jest, test, expect, beforeEach } from "@jest/globals";
import LogOffUseCase from "../../../../src/application/use-cases/auth/LogOffUseCase.js";
import InvalidTokenError from "../../../../src/application/errors/InvalidTokenError.js";
import SessionEntity from "../../../../src/domain/entities/SessionEntity.js";

describe("Testes de Aplicação: LogOffUseCase", () => {
    const sessionRepositoryMock = {
        findByJti: jest.fn(),
        deleteByJti: jest.fn(),
    };

    const tokenProviderMock = {
        verifyRefreshToken: jest.fn(),
        decodeToken: jest.fn(),
    };

    const sut = new LogOffUseCase({
        sessionRepository: sessionRepositoryMock,
        tokenProvider: tokenProviderMock,
    });

    const mockSession = SessionEntity.restore({
        idSession: 100,
        idUser: 1,
        token: "hashed-token",
        jti: "jti-valido",
        expiresAt: 9999999,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Deve deslogar com sucesso revogando a sessão do usuário usando o refreshToken", async () => {
        tokenProviderMock.verifyRefreshToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        tokenProviderMock.decodeToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        sessionRepositoryMock.findByJti.mockResolvedValue(mockSession);
        sessionRepositoryMock.deleteByJti.mockResolvedValue();

        await expect(sut.execute({
            refreshToken: "refresh-token-valido"
        })).resolves.not.toThrow();

        expect(tokenProviderMock.verifyRefreshToken).toHaveBeenCalledWith({ refreshToken: "refresh-token-valido" });
        expect(tokenProviderMock.decodeToken).toHaveBeenCalledWith({ token: "refresh-token-valido" });
        expect(sessionRepositoryMock.findByJti).toHaveBeenCalledWith({ jti: "jti-valido" });
        expect(sessionRepositoryMock.deleteByJti).toHaveBeenCalledWith({ jti: "jti-valido" });
    });

    test("Deve lançar erro se a validação do refresh token falhar", async () => {
        const error = new Error("Token de atualização expirado");
        tokenProviderMock.verifyRefreshToken.mockRejectedValue(error);

        await expect(sut.execute({
            refreshToken: "refresh-token-invalido"
        })).rejects.toThrow(error);
    });

    test("Deve lançar InvalidTokenError se o token decodificado não tiver jti", async () => {
        tokenProviderMock.verifyRefreshToken.mockResolvedValue({ id: 1, email: "lucas@email.com" });
        tokenProviderMock.decodeToken.mockResolvedValue({ id: 1, email: "lucas@email.com" });

        await expect(sut.execute({
            refreshToken: "refresh-token-valido"
        })).rejects.toThrow(InvalidTokenError);
    });

    test("Deve lançar InvalidTokenError se a sessão não for encontrada no banco", async () => {
        tokenProviderMock.verifyRefreshToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        tokenProviderMock.decodeToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        sessionRepositoryMock.findByJti.mockResolvedValue(null);

        await expect(sut.execute({
            refreshToken: "refresh-token-valido"
        })).rejects.toThrow(InvalidTokenError);
    });
});
