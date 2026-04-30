import { jest } from "@jest/globals";
import CreateUserUseCase from "../../../../src/application/use-cases/user/CreateUserUseCase.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";

describe("Testes de Aplicação: CreateUserUseCase", () => {

    const userRepositoryMocke = {
        findByEmail: jest.fn(),
        create: jest.fn()
    };

    const hashProviderMocke = {
        hash: jest.fn(),
        compare: jest.fn()
    };

    const sutCreateUserUseCase = new CreateUserUseCase({
        userRepository: userRepositoryMocke,
        hashProvider: hashProviderMocke
    });

    describe("Validação da implementação do método 'execute':", () => {

        const dataValid = {
            id: "1",
            name: "Lucas Anchieta",
            email: "lucas@mail.com"
        };

        const createUserRequestDTO = {
            email: "lucas@mail.com",
            password: "SenhaTeste@2025",
            name: "Lucas Anchieta"
        };

        const mockSavedEntity = new UserEntity({
            id: "1",
            name: "Lucas Anchieta",
            email: "lucas@mail.com",
            password: "hashedPassword",
            alreadyHashed: true
        });

        test("Deve retornar um ApplicationError caso o email já exista, retornando a exceção de conflito", async () => {
            userRepositoryMocke.findByEmail.mockResolvedValue(mockSavedEntity);

            await expect(sutCreateUserUseCase.execute({ createUserRequestDTO }))
                .rejects.toThrow("E-mail já cadastrado");
        });

        test("Deve criar um usuário, retornando o DTO de resposta válido", async () => {
            userRepositoryMocke.findByEmail.mockResolvedValue(null);
            userRepositoryMocke.create.mockResolvedValue(mockSavedEntity);
            hashProviderMocke.hash.mockResolvedValue("hashedPassword");

            await expect(sutCreateUserUseCase.execute({ createUserRequestDTO }))
                .resolves.toEqual(dataValid);
        });

        test("Deve retornar um ApplicationError caso a senha não seja hashed, retornando erro interno do servidor", async () => {
            userRepositoryMocke.findByEmail.mockResolvedValue(null);
            userRepositoryMocke.create.mockResolvedValue(null);
            hashProviderMocke.hash.mockResolvedValue(null);
            try {
                await sutCreateUserUseCase.execute({ createUserRequestDTO });
            } catch (error) {
                expect(error.description).toEqual("Ocorreu um erro ao processar a sua senha.");
            }
        });
    });

});
