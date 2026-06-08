import { describe, jest, test, expect } from "@jest/globals";
import JwtTokenProvider from "../../../src/infra/providers/token/JwtTokenProvider.js";
import TokenError from "../../../src/infra/errors/TokenError.js";

describe("Testes de Infraestrutura: JwtTokenProvider", () => {
    const jwtMock = {
        sign: jest.fn(),
        verify: jest.fn(),
        decode: jest.fn(),
    };

    const cryptoMock = {
        randomUUID: jest.fn().mockReturnValue("mocked-uuid-123"),
    };

    const envsMock = {
        jwt: {
            accessSecretKey: "access-secret-key-test",
            refreshSecretKey: "refresh-secret-key-test",
        },
    };

    const sut = new JwtTokenProvider({
        jwt: jwtMock,
        crypto: cryptoMock,
        envs: envsMock,
    });

    describe("Validação do método 'generateAccessToken':", () => {
        test("Deve gerar token de acesso utilizando a chave correta", async () => {
            jwtMock.sign.mockReturnValue("signed-access-token");

            const result = await sut.generateAccessToken({
                payload: { id: 1, email: "test@email.com" },
                expires: "1h",
            });

            expect(result).toBe("signed-access-token");
            expect(cryptoMock.randomUUID).toHaveBeenCalled();
            expect(jwtMock.sign).toHaveBeenCalledWith(
                { id: 1, email: "test@email.com", jti: "mocked-uuid-123" },
                "access-secret-key-test",
                { expiresIn: "1h" }
            );
        });

        test("Deve lançar TokenError quando a assinatura falhar", async () => {
            jwtMock.sign.mockImplementation(() => {
                throw new Error("Erro de Assinatura");
            });

            await expect(sut.generateAccessToken({ payload: {}, expires: "1h" }))
                .rejects.toThrow(TokenError);
        });
    });

    describe("Validação do método 'generateRefreshToken':", () => {
        test("Deve gerar token de atualização utilizando a chave correta", async () => {
            jwtMock.sign.mockReturnValue("signed-refresh-token");

            const result = await sut.generateRefreshToken({
                payload: { id: 1, email: "test@email.com" },
                expires: "7d",
            });

            expect(result).toBe("signed-refresh-token");
            expect(cryptoMock.randomUUID).toHaveBeenCalled();
            expect(jwtMock.sign).toHaveBeenCalledWith(
                { id: 1, email: "test@email.com", jti: "mocked-uuid-123" },
                "refresh-secret-key-test",
                { expiresIn: "7d" }
            );
        });
    });

    describe("Validação do método 'verifyAccessToken':", () => {
        test("Deve validar o token de acesso com sucesso usando a chave correta", async () => {
            const decodedPayload = { id: 1, email: "test@email.com", jti: "uuid" };
            jwtMock.verify.mockReturnValue(decodedPayload);

            const result = await sut.verifyAccessToken({ accessToken: "token-valido" });

            expect(result).toEqual(decodedPayload);
            expect(jwtMock.verify).toHaveBeenCalledWith("token-valido", "access-secret-key-test");
        });

        test("Deve lançar TokenError quando a verificação falhar", async () => {
            jwtMock.verify.mockImplementation(() => {
                throw new Error("Token expirado");
            });

            await expect(sut.verifyAccessToken({ accessToken: "token-expirado" }))
                .rejects.toThrow(TokenError);
        });
    });

    describe("Validação do método 'verifyRefreshToken':", () => {
        test("Deve validar o token de atualização com sucesso usando a chave correta", async () => {
            const decodedPayload = { id: 1, email: "test@email.com", jti: "uuid" };
            jwtMock.verify.mockReturnValue(decodedPayload);

            const result = await sut.verifyRefreshToken({ refreshToken: "refresh-valido" });

            expect(result).toEqual(decodedPayload);
            expect(jwtMock.verify).toHaveBeenCalledWith("refresh-valido", "refresh-secret-key-test");
        });

        test("Deve lançar TokenError quando a verificação falhar", async () => {
            jwtMock.verify.mockImplementation(() => {
                throw new Error("Assinatura inválida");
            });

            await expect(sut.verifyRefreshToken({ refreshToken: "refresh-invalido" }))
                .rejects.toThrow(TokenError);
        });
    });

    describe("Validação do método 'decodeToken':", () => {
        test("Deve decodificar o token sem verificar assinatura", async () => {
            const payload = { id: 1, email: "test@email.com" };
            jwtMock.decode.mockReturnValue(payload);

            const result = await sut.decodeToken({ token: "token-qualquer" });

            expect(result).toEqual(payload);
            expect(jwtMock.decode).toHaveBeenCalledWith("token-qualquer");
        });

        test("Deve lançar TokenError quando a decodificação falhar", async () => {
            jwtMock.decode.mockImplementation(() => {
                throw new Error("Erro ao decodificar");
            });

            await expect(sut.decodeToken({ token: "token-corrompido" }))
                .rejects.toThrow(TokenError);
        });
    });
});
