import { describe, jest } from "@jest/globals";
import LoginUseCase from "../../../../src/application/use-cases/auth/LoginUseCase.js";
import LoginRequestDTO from "../../../../src/application/dtos/auth/LoginRequestDTO.js";
import LoginResponseDTO from "../../../../src/application/dtos/auth/LoginResponseDTO.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";

describe("Testes de Aplicação: LoginUseCase", () => {

    const userRepositoryMock = {
        findAuthByEmail: jest.fn(),
    };

    const hashProviderMock = {
        compare: jest.fn(),
    };

    const tokenProviderMock = {
        generateToken: jest.fn(),
    };

    const sutLoginUseCase = new LoginUseCase({
        userRepository: userRepositoryMock,
        hashProvider: hashProviderMock,
        tokenProvider: tokenProviderMock
    });

    const mockUserEntity = new UserEntity({
        id: "id-valido",
        name: "Lucas Anchieta",
        email: "lucas@email.com",
        password: "hashed_password",
        alreadyHashed: true
    });

    describe("Validação da implementação do metodo 'execute':", () => {
        test("Deve retornar um ApplicationError quando não for enviado ou email ou senha", async () => {
            const loginRequestDTO = new LoginRequestDTO({
                email: "",
                password: ""
            });

            await expect(sutLoginUseCase.execute({ loginRequestDTO }))
                .rejects.toThrow("E-mail e senha são obrigatórios");
        });

        test("Deve retornar um ApplicationError quando o email for inválido", async () => {
            userRepositoryMock.findAuthByEmail.mockResolvedValue(null);

            const loginRequestDTO = new LoginRequestDTO({
                email: "invalido@email.com",
                password: "qualquer_senha"
            });

            await expect(sutLoginUseCase.execute({ loginRequestDTO }))
                .rejects.toThrow("Credenciais inválidas");
        });

        test("Deve retornar um ApplicationError quando a senha for inválida", async () => {
            userRepositoryMock.findAuthByEmail.mockResolvedValue(mockUserEntity);
            hashProviderMock.compare.mockResolvedValue(false);

            const loginRequestDTO = new LoginRequestDTO({
                email: "lucas@email.com",
                password: "senha_errada"
            });

            await expect(sutLoginUseCase.execute({ loginRequestDTO }))
                .rejects.toThrow("Credenciais inválidas");
        });

        test("Deve retornar um LoginResponseDTO quando o email e senha forem válidos", async () => {
            userRepositoryMock.findAuthByEmail.mockResolvedValue(mockUserEntity);
            hashProviderMock.compare.mockResolvedValue(true);
            tokenProviderMock.generateToken.mockResolvedValue("token");

            const loginRequestDTO = new LoginRequestDTO({
                email: "lucas@email.com",
                password: "SenhaValida@123"
            });

            const result = await sutLoginUseCase.execute({ loginRequestDTO });

            expect(result).toBeInstanceOf(LoginResponseDTO);
            expect(result).toEqual({
                token: "token",
                user: {
                    id: "id-valido",
                    name: "Lucas Anchieta",
                    email: "lucas@email.com"
                }
            });
        });
    });
});
