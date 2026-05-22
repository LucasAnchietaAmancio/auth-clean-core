import { describe, jest, test, expect, beforeEach } from "@jest/globals";
import LogoutController from "../../../../src/presentation/controllers/auth/LogoutController.js";

describe("Testes de Apresentação: LogoutController", () => {
    const logoutUseCaseMock = {
        execute: jest.fn(),
    };

    const sut = new LogoutController({
        logoutUseCase: logoutUseCaseMock,
    });

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            cookies: {
                refreshToken: "refresh-token-mock",
            },
        };
        res = {
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("Validação do método 'handle':", () => {
        test("Deve realizar logoff, limpar cookie do refreshToken e retornar status 200", async () => {
            logoutUseCaseMock.execute.mockResolvedValue();

            await sut.handle(req, res, next);

            expect(logoutUseCaseMock.execute).toHaveBeenCalledWith({
                refreshToken: "refresh-token-mock",
            });
            expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Logoff realizado com sucesso",
            });
            expect(next).not.toHaveBeenCalled();
        });

        test("Deve chamar next(error) quando a execução do use case falhar", async () => {
            const error = new Error("Token inválido");
            logoutUseCaseMock.execute.mockRejectedValue(error);

            await sut.handle(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.clearCookie).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
