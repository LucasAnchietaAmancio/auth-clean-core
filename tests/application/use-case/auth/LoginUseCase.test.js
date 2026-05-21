import { describe, jest, test, expect } from "@jest/globals";
import LoginUseCase from "../../../../src/application/use-cases/auth/LoginUseCase.js";
import LoginRequestDTO from "../../../../src/application/use-cases/auth/dtos/LoginRequestDTO.js";
import LoginResponseDTO from "../../../../src/application/use-cases/auth/dtos/LoginResponseDTO.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";
import InvalidCredentialsError from "../../../../src/application/errors/InvalidCredentialsError.js";

describe("Testes de Aplicação: LoginUseCase", () => {

    const userRepositoryMock = {
        findByEmail: jest.fn(),
    };

    const sessionTokenServiceMock = {
        generateSessionTokens: jest.fn(),
    };

    const hashProviderMock = {
        compare: jest.fn(),
    };

    const tokenProviderMock = {};
    const sessionRepositoryMock = {};

    const sutLoginUseCase = new LoginUseCase({
        userRepository: userRepositoryMock,
        hashProvider: hashProviderMock,
        sessionTokenService: sessionTokenServiceMock,
        tokenProvider: tokenProviderMock,
        sessionRepository: sessionRepositoryMock,
    });

    const mockUserEntity = UserEntity.restore({
        idUser: "id-valido",
        name: "Lucas Anchieta",
        email: "lucas@email.com",
        hashedPassword: "hashed_password"
    });

    test("Deve retornar um LoginResponseDTO válido quando as credenciais estiverem corretas", async () => {
        userRepositoryMock.findByEmail.mockResolvedValue(mockUserEntity);
        hashProviderMock.compare.mockResolvedValue(true);
        sessionTokenServiceMock.generateSessionTokens.mockResolvedValue({
            accessToken: "access-token",
            refreshToken: "refresh-token"
        });

        const loginRequestDTO = new LoginRequestDTO({
            email: "lucas@email.com",
            password: "SenhaValida@123"
        });

        const result = await sutLoginUseCase.execute({ loginRequestDTO });

        expect(result).toBeInstanceOf(LoginResponseDTO);
        expect(result.accessToken).toBe("access-token");
        expect(result.refreshToken).toBe("refresh-token");
        expect(sessionTokenServiceMock.generateSessionTokens).toHaveBeenCalledWith({
            idUser: "id-valido",
            email: "lucas@email.com"
        });
        expect(result.user).toEqual({
            idUser: "id-valido",
            name: "Lucas Anchieta"
        });
    });

    test("Deve lançar InvalidCredentialsError quando o usuário não for encontrado", async () => {
        userRepositoryMock.findByEmail.mockResolvedValue(null);

        const loginRequestDTO = new LoginRequestDTO({
            email: "inexistente@email.com",
            password: "SenhaQualquer@123"
        });

        await expect(sutLoginUseCase.execute({ loginRequestDTO }))
            .rejects.toThrow(InvalidCredentialsError);
    });

    test("Deve lançar InvalidCredentialsError quando a senha estiver incorreta", async () => {
        userRepositoryMock.findByEmail.mockResolvedValue(mockUserEntity);
        hashProviderMock.compare.mockResolvedValue(false);

        const loginRequestDTO = new LoginRequestDTO({
            email: "lucas@email.com",
            password: "SenhaErrada@123"
        });

        await expect(sutLoginUseCase.execute({ loginRequestDTO }))
            .rejects.toThrow(InvalidCredentialsError);
    });
});
