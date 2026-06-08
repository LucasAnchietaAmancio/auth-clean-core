import { describe, jest, test, expect, beforeEach } from "@jest/globals";
import LoginController from "../../../../src/presentation/controllers/auth/LoginController.js";
import LoginResponseDTO from "../../../../src/application/use-cases/auth/dtos/LoginResponseDTO.js";

describe("Testes de Apresentação: LoginController", () => {
    const loginUseCaseMock = {
        execute: jest.fn(),
    };

    const envsMock = {
        jwt: {
            accessTokenCookieMaxAgeMs: 900000,
            refreshTokenCookieMaxAgeMs: 604800000,
        },
    };

    const sut = new LoginController({
        loginUseCase: loginUseCaseMock,
        envs: envsMock,
    });

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                email: "test@email.com",
                password: "password123",
            },
        };
        res = {
            cookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("Validação do método 'handle':", () => {
        test("Deve realizar login, definir cookies seguros e retornar status 200", async () => {

            const loginResponse = new LoginResponseDTO({
                accessToken: "access-token-valido",
                refreshToken: "refresh-token-valido",
                user: {
                    idUser: "1",
                    name: "User Mock"
                }
            });

            loginUseCaseMock.execute.mockResolvedValue(loginResponse);

            await sut.handle(req, res, next);

            expect(loginUseCaseMock.execute).toHaveBeenCalled();

            expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refresh-token-valido", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000,
            });

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Login realizado com sucesso",
                metadata: {
                    idUser: "1",
                    accessToken: "access-token-valido"
                }
            });

            expect(next).not.toHaveBeenCalled();
        });

        test("Deve chamar next(error) quando a execução do use case falhar", async () => {
            const error = new Error("Credenciais inválidas");
            loginUseCaseMock.execute.mockRejectedValue(error);

            await sut.handle(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
