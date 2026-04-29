import { jest } from "@jest/globals";
import CreateUserUseCase from "../../../../src/application/use-cases/user/CreateUserUseCase.js";

describe("Testes de Aplicação: CreateUserUseCase", () => {

    const userRepositoryMocke = {
        findByEmail: jest.fn(),
        create: jest.fn()
    }

    const sutCreateUserUseCase = new CreateUserUseCase(userRepositoryMocke);

    test("Deve retornar um ApplicationError caso o email já exista", async () => {

        const dataValid = {
            id: "1",
            name: "Lucas Anchieta",
            email: "lucas@mail.com"
        };

        userRepositoryMocke.findByEmail.mockResolvedValue(dataValid);

        await expect(sutCreateUserUseCase.execute({ email: "lucas@mail.com", password: "SenhaTeste@2025", name: "Lucas Anchieta" }))
            .rejects.toThrow("E-mail já cadastrado");
    })
});
