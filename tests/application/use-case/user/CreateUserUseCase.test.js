import { jest } from "@jest/globals";
import CreateUserUseCase from "../../../../src/application/use-cases/user/CreateUserUseCase.js";

describe("Testes de Aplicação: CreateUserUseCase", () => {

    const userRepositoryMocke = {
        findByEmail: jest.fn(),
        create: jest.fn()
    };

    const hashProviderMocke = {
        hash: jest.fn(),
        compare: jest.fn()
    };

    const sutCreateUserUseCase = new CreateUserUseCase(userRepositoryMocke, hashProviderMocke);

    describe("Validação de criação de usuário", () => {

        const dataValid = {
            id: "1",
            name: "Lucas Anchieta",
            email: "lucas@mail.com"
        };

        test("Deve retornar um ApplicationError caso o email já exista", async () => {

            userRepositoryMocke.findByEmail.mockResolvedValue(dataValid);

            await expect(sutCreateUserUseCase.execute({ email: "lucas@mail.com", password: "SenhaTeste@2025", name: "Lucas Anchieta" }))
                .rejects.toThrow("E-mail já cadastrado");
        });

        test("Deve criar um usuário", async () => {

            userRepositoryMocke.findByEmail.mockResolvedValue(null);
            userRepositoryMocke.create.mockResolvedValue(dataValid);
            hashProviderMocke.hash.mockResolvedValue("$2b$12$NygFN5roLN2CfhB3GUsWgO53sm7dgP3Y8zgMZcJCCND1HEtRposci");

            await expect(sutCreateUserUseCase.execute({ email: "lucas@mail.com", password: "SenhaTeste@2025", name: "Lucas Anchieta" }))
                .resolves.toEqual(dataValid);
        });

        test("Deve retornar um ApplicationError caso a senha não seja hashed", async () => {

            userRepositoryMocke.findByEmail.mockResolvedValue(null);
            userRepositoryMocke.create.mockResolvedValue(null);
            hashProviderMocke.hash.mockResolvedValue(null);
            try {
                await sutCreateUserUseCase.execute({ email: "lucas@mail.com", password: "SenhaTeste@2025", name: "Lucas Anchieta" });
            } catch (error) {
                expect(error.description).toEqual("Ocorreu um erro ao processar a sua senha.");
            }
        });
    });

});

