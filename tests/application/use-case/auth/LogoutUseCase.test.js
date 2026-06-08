import { describe, jest, test, expect, beforeEach, afterEach } from "@jest/globals";
import LogoutUseCase from "../../../../src/application/use-cases/auth/LogoutUseCase.js";
import InvalidTokenError from "../../../../src/application/errors/InvalidTokenError.js";
import SessionEntity from "../../../../src/domain/entities/SessionEntity.js";

describe("Testes de Aplicação: LogoutUseCase", () => {
    const sessionRepositoryMock = {
        findByJti: jest.fn(),
        deleteByJti: jest.fn(),
    };

    const tokenProviderMock = {
        verifyRefreshToken: jest.fn(),
        verifyAccessToken: jest.fn(),
    };

    const cacheProviderMock = {
        set: jest.fn(),
    };

    const sut = new LogoutUseCase({
        sessionRepository: sessionRepositoryMock,
        tokenProvider: tokenProviderMock,
        cacheProvider: cacheProviderMock,
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
        jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("Deve deslogar com sucesso revogando a sessão do usuário usando o refreshToken", async () => {
        tokenProviderMock.verifyRefreshToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        tokenProviderMock.verifyAccessToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "access-jti", exp: 2_000 });
        sessionRepositoryMock.findByJti.mockResolvedValue(mockSession);
        cacheProviderMock.set.mockResolvedValue();
        sessionRepositoryMock.deleteByJti.mockResolvedValue();

        await expect(sut.execute({
            refreshToken: "refresh-token-valido",
            accessToken: "access-token-valido"
        })).resolves.not.toThrow();

        expect(tokenProviderMock.verifyRefreshToken).toHaveBeenCalledWith({ refreshToken: "refresh-token-valido" });
        expect(tokenProviderMock.verifyAccessToken).toHaveBeenCalledWith({ accessToken: "access-token-valido" });
        expect(sessionRepositoryMock.findByJti).toHaveBeenCalledWith({ jti: "jti-valido" });
        expect(cacheProviderMock.set).toHaveBeenCalledWith({
            key: "auth:blacklist:access-jti",
            value: "revoked",
            expiresIn: 1000,
        });
        expect(sessionRepositoryMock.deleteByJti).toHaveBeenCalledWith({ jti: "jti-valido" });
    });

    test("Deve lançar erro se a validação do refresh token falhar", async () => {
        const error = new Error("Token de atualização expirado");
        tokenProviderMock.verifyRefreshToken.mockRejectedValue(error);

        await expect(sut.execute({
            refreshToken: "refresh-token-invalido"
        })).rejects.toThrow(error);
    });

    test("Deve lançar InvalidTokenError se o access token não tiver jti", async () => {
        tokenProviderMock.verifyRefreshToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        tokenProviderMock.verifyAccessToken.mockResolvedValue({ id: 1, email: "lucas@email.com" });
        sessionRepositoryMock.findByJti.mockResolvedValue(mockSession);

        await expect(sut.execute({
            refreshToken: "refresh-token-valido",
            accessToken: "access-token-valido"
        })).rejects.toThrow(InvalidTokenError);
    });

    test("Deve lançar InvalidTokenError se a sessão não for encontrada no banco", async () => {
        tokenProviderMock.verifyRefreshToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "jti-valido" });
        tokenProviderMock.verifyAccessToken.mockResolvedValue({ id: 1, email: "lucas@email.com", jti: "access-jti", exp: 2_000 });
        sessionRepositoryMock.findByJti.mockResolvedValue(null);
        cacheProviderMock.set.mockResolvedValue();

        await expect(sut.execute({
            refreshToken: "refresh-token-valido",
            accessToken: "access-token-valido"
        })).rejects.toThrow(InvalidTokenError);
    });
});
