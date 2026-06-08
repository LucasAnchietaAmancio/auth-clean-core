import { describe, jest, test, expect, beforeEach } from "@jest/globals";
import RotationSessionController from "../../../../src/presentation/controllers/auth/RotationSessionController.js";
import RotationSessionResponseDTO from "../../../../src/application/use-cases/auth/dtos/RotationSessionResponseDTO.js";

describe("Testes de Apresentação: RotationSessionController", () => {
    const rotationSessionUseCaseMock = {
        execute: jest.fn(),
    };

    const envsMock = {
        jwt: {
            accessTokenCookieMaxAgeMs: 900000,
            refreshTokenCookieMaxAgeMs: 604800000,
        },
    };

    const sut = new RotationSessionController({
        rotationSessionUseCase: rotationSessionUseCaseMock,
        envs: envsMock,
    });

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            cookies: {
                refreshToken: "current-refresh-token-mock",
            },
        };
        res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("Validação do método 'handle':", () => {
        test("Deve rotacionar a sessão obtendo o token do cookie, redefinir cookies e retornar status 200", async () => {
            const rotationResponse = new RotationSessionResponseDTO({
                accessToken: "new-access-token-mock",
                refreshToken: "new-refresh-token-mock",
                user: { idUser: "1", name: "User Mock" },
            });

            rotationSessionUseCaseMock.execute.mockResolvedValue(rotationResponse);

            await sut.handle(req, res, next);

            expect(rotationSessionUseCaseMock.execute).toHaveBeenCalled();

            expect(res.cookie).toHaveBeenCalledWith("refreshToken", "new-refresh-token-mock", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000,
            });

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Sessão rotacionada com sucesso",
                metadata: {
                    idUser: "1",
                    accessToken: "new-access-token-mock"
                },
            });
            expect(next).not.toHaveBeenCalled();
        });

        test("Deve chamar next(error) quando a execução da rotação falhar", async () => {
            const error = new Error("Token inválido");
            rotationSessionUseCaseMock.execute.mockRejectedValue(error);

            await sut.handle(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
