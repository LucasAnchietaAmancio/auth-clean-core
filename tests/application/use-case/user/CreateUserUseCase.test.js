import { describe, jest, test, expect } from "@jest/globals";
import CreateUserUseCase from "../../../../src/application/use-cases/user/CreateUserUseCase.js";
import CreateUserRequestDTO from "../../../../src/application/dtos/user/CreateUserRequestDTO.js";
import CreateUserResponseDTO from "../../../../src/application/dtos/user/CreateUserResponseDTO.js";
import EmailAlreadyInUseError from "../../../../src/application/errors/EmailAlreadyInUseError.js";
import InternalApplicationError from "../../../../src/application/errors/InternalApplicationError.js";

describe("Testes de Aplicação: CreateUserUseCase", () => {

    const userRepositoryMock = {
        findByEmail: jest.fn(),
        save: jest.fn(),
    };

    const hashProviderMock = {
        hash: jest.fn(),
    };

    const sutCreateUserUseCase = new CreateUserUseCase({
        userRepository: userRepositoryMock,
        hashProvider: hashProviderMock,
    });

    const validUserRequest = new CreateUserRequestDTO({
        name: "Novo Usuário",
        email: "novo@email.com",
        password: "SenhaValida@123"
    });

    test("Deve criar um usuário com sucesso", async () => {
        userRepositoryMock.findByEmail.mockResolvedValue(null);
        hashProviderMock.hash.mockResolvedValue("hashed_password");
        userRepositoryMock.save.mockResolvedValue({
            id: "id-gerado",
            name: { value: "Novo Usuário" },
            email: { value: "novo@email.com" }
        });

        const result = await sutCreateUserUseCase.execute({ createUserRequestDTO: validUserRequest });

        expect(result).toBeInstanceOf(CreateUserResponseDTO);
        expect(result.id).toBe("id-gerado");
        expect(userRepositoryMock.save).toHaveBeenCalled();
    });

    test("Deve lançar EmailAlreadyInUseError quando o e-mail já estiver cadastrado", async () => {
        userRepositoryMock.findByEmail.mockResolvedValue({ id: "existente" });

        await expect(sutCreateUserUseCase.execute({ createUserRequestDTO: validUserRequest }))
            .rejects.toThrow(EmailAlreadyInUseError);
    });

    test("Deve lançar InternalApplicationError quando houver falha na geração do hash", async () => {
        userRepositoryMock.findByEmail.mockResolvedValue(null);
        hashProviderMock.hash.mockResolvedValue(null); // Falha simulada

        await expect(sutCreateUserUseCase.execute({ createUserRequestDTO: validUserRequest }))
            .rejects.toThrow(InternalApplicationError);
    });
});
