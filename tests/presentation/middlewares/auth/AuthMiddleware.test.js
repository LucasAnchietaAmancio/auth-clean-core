import { describe, jest, test, expect, beforeEach } from "@jest/globals";
import AuthMiddleware from "../../../../src/presentation/middlewares/auth/AuthMiddleware.js";
import InvalidTokenError from "../../../../src/application/errors/InvalidTokenError.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";

describe("Testes de Apresentação: AuthMiddleware", () => {
    const tokenProviderMock = {
        verifyAccessToken: jest.fn(),
    };

    const userRepositoryMock = {
        findByEmail: jest.fn(),
    };

    const sut = new AuthMiddleware({
        tokenProvider: tokenProviderMock,
        userRepository: userRepositoryMock,
    });

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("Validação do fluxo do middleware:", () => {
        test("Deve permitir o acesso chamando next() e injetar req.user quando o token de acesso for válido", async () => {
            req.headers.authorization = "Bearer token-valido";
            tokenProviderMock.verifyAccessToken.mockResolvedValue({
                id: 1,
                email: "test@email.com",
            });
            userRepositoryMock.findByEmail.mockResolvedValue(
                UserEntity.restore({
                    id: 1,
                    name: "User Test",
                    email: "test@email.com",
                    hashedPassword: "hashed",
                })
            );

            const middlewareFn = sut.execute();
            await middlewareFn(req, res, next);

            expect(tokenProviderMock.verifyAccessToken).toHaveBeenCalledWith({ accessToken: "token-valido" });
            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith({ email: "test@email.com" });
            expect(req.user).toEqual({
                id: 1,
                email: "test@email.com",
            });
            expect(next).toHaveBeenCalledWith();
        });

        test("Deve chamar next(error) com InvalidTokenError se o cabeçalho Authorization estiver ausente", async () => {
            const middlewareFn = sut.execute();
            await middlewareFn(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(InvalidTokenError));
            expect(next.mock.calls[0][0].metadata.cause).toContain("Token de acesso não fornecido");
        });

        test("Deve chamar next(error) com InvalidTokenError se o cabeçalho não começar com Bearer", async () => {
            req.headers.authorization = "Basic credentials";

            const middlewareFn = sut.execute();
            await middlewareFn(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(InvalidTokenError));
        });

        test("Deve chamar next(error) com InvalidTokenError se o token decodificado for inválido ou sem e-mail", async () => {
            req.headers.authorization = "Bearer token-sem-email";
            tokenProviderMock.verifyAccessToken.mockResolvedValue({
                id: 1,
                // sem email
            });

            const middlewareFn = sut.execute();
            await middlewareFn(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(InvalidTokenError));
        });

        test("Deve chamar next(error) com o erro original quando o tokenProvider falhar na verificação", async () => {
            req.headers.authorization = "Bearer token-expirado";
            const originalError = new Error("Token expired");
            tokenProviderMock.verifyAccessToken.mockRejectedValue(originalError);

            const middlewareFn = sut.execute();
            await middlewareFn(req, res, next);

            expect(next).toHaveBeenCalledWith(originalError);
        });

        test("Deve chamar next(error) com InvalidTokenError se o usuário não for encontrado no banco de dados", async () => {
            req.headers.authorization = "Bearer token-valido";
            tokenProviderMock.verifyAccessToken.mockResolvedValue({
                id: 1,
                email: "test@email.com",
            });
            userRepositoryMock.findByEmail.mockResolvedValue(null);

            const middlewareFn = sut.execute();
            await middlewareFn(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(InvalidTokenError));
            expect(next.mock.calls[0][0].metadata.cause).toContain("Usuário não encontrado ou inativo");
        });
    });
});
