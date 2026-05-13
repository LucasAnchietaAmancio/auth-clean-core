import { describe, jest, test, expect } from "@jest/globals";
import LoginUseCase from "../../../../src/application/use-cases/auth/LoginUseCase.js";
import LoginRequestDTO from "../../../../src/application/dtos/auth/LoginRequestDTO.js";
import LoginResponseDTO from "../../../../src/application/dtos/auth/LoginResponseDTO.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";
import InvalidCredentialsError from "../../../../src/application/errors/InvalidCredentialsError.js";

describe("Testes de Aplicação: LoginUseCase", () => {

    const userRepositoryMock = {
        findAuthByEmail: jest.fn(),
    };

    const refreshTokenRepositoryMock = {
        create: jest.fn(),
    };

    const hashProviderMock = {
        compare: jest.fn(),
    };

    const tokenProviderMock = {
        generateToken: jest.fn(),
        decodeToken: jest.fn(),
    };

    const envsMock = {
        jwt: {
            accessTokenExpiresIn: "1h",
            refreshTokenExpiresIn: "7d"
        }
    };

    const sutLoginUseCase = new LoginUseCase({
        userRepository: userRepositoryMock,
        refreshTokenRepository: refreshTokenRepositoryMock,
        hashProvider: hashProviderMock,
        tokenProvider: tokenProviderMock,
        envs: envsMock
    });

    const mockUserEntity = new UserEntity({
        id: "id-valido",
        name: "Lucas Anchieta",
        email: "lucas@email.com",
        password: "hashed_password",
        alreadyHashed: true
    });

    test("Deve retornar um LoginResponseDTO válido quando as credenciais estiverem corretas", async () => {
        userRepositoryMock.findAuthByEmail.mockResolvedValue(mockUserEntity);
        hashProviderMock.compare.mockResolvedValue(true);
        tokenProviderMock.generateToken
            .mockResolvedValueOnce("access-token")
            .mockResolvedValueOnce("refresh-token");

        tokenProviderMock.decodeToken.mockResolvedValue({
            jti: "jti-mock",
            exp: 9999999999
        });

        refreshTokenRepositoryMock.create.mockResolvedValue({});

        const loginRequestDTO = new LoginRequestDTO({
            email: "lucas@email.com",
            password: "SenhaValida@123"
        });

        const result = await sutLoginUseCase.execute({ loginRequestDTO });

        expect(result).toBeInstanceOf(LoginResponseDTO);
        expect(result.accessToken).toBe("access-token");
        expect(result.refreshToken).toBe("refresh-token");
        expect(refreshTokenRepositoryMock.create).toHaveBeenCalled();
        expect(result.user).toEqual({
            id: "id-valido",
            name: "Lucas Anchieta",
            email: "lucas@email.com"
        });
    });

    test("Deve lançar InvalidCredentialsError quando o usuário não for encontrado", async () => {
        userRepositoryMock.findAuthByEmail.mockResolvedValue(null);

        const loginRequestDTO = new LoginRequestDTO({
            email: "inexistente@email.com",
            password: "SenhaQualquer@123"
        });

        await expect(sutLoginUseCase.execute({ loginRequestDTO }))
            .rejects.toThrow(InvalidCredentialsError);
    });

    test("Deve lançar InvalidCredentialsError quando a senha estiver incorreta", async () => {
        userRepositoryMock.findAuthByEmail.mockResolvedValue(mockUserEntity);
        hashProviderMock.compare.mockResolvedValue(false);

        const loginRequestDTO = new LoginRequestDTO({
            email: "lucas@email.com",
            password: "SenhaErrada@123"
        });

        await expect(sutLoginUseCase.execute({ loginRequestDTO }))
            .rejects.toThrow(InvalidCredentialsError);
    });
});