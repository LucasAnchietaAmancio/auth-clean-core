import UserRepository from "../../../../src/infrastructure/database/repositories/UserRepository.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";
import { jest } from "@jest/globals";

describe("Testes de Infraestrutura: UserRepository", () => {
    const dbMock = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn()
        }
    };

    const sutUserRepository = new UserRepository({ db: dbMock });

    const UserEntityExample = new UserEntity({
        name: "Lucas",
        email: "lucas@email.com",
        password: "$2b$12$NygFN5roLN2CfhB3GUsWgO53sm7dgP3Y8zgMZcJCCND1HEtRposci"
    });

    describe("Validação da implementação do método 'create':", () => {
        test("Deve criar um usuário no banco de dados, retornando a Entidade de Domínio", async () => {
            dbMock.user.create.mockResolvedValue({
                id: "1",
                name: "Lucas",
                email: "lucas@email.com",
                password: "$2b$12$NygFN5roLN2CfhB3GUsWgO53sm7dgP3Y8zgMZcJCCND1HEtRposci",
                createdAt: "2024-10-27T10:00:00.000Z",
                updatedAt: "2024-10-27T10:00:00.000Z"
            });

            const result = await sutUserRepository.create({ userEntity: UserEntityExample });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe("1");
            expect(result.email.value).toBe("lucas@email.com");
        });

        test("Deve lançar um erro caso o usuário já exista", async () => {
            dbMock.user.create.mockRejectedValue({
                code: "P2002"
            });

            await expect(sutUserRepository.create({ userEntity: UserEntityExample }))
                .rejects.toThrow("E-mail já cadastrado");
        });
    });

    describe("Validação da implementação do método 'findByEmail':", () => {
        test("Deve buscar um usuário no banco de dados, retornando a Entidade de Domínio", async () => {
            dbMock.user.findUnique.mockResolvedValue({
                id: "1",
                name: "Lucas",
                email: "lucas@email.com",
                password: "$2b$12$NygFN5roLN2CfhB3GUsWgO53sm7dgP3Y8zgMZcJCCND1HEtRposci",
                createdAt: "2024-10-27T10:00:00.000Z",
                updatedAt: "2024-10-27T10:00:00.000Z"
            });

            const result = await sutUserRepository.findByEmail({ email: "lucas@email.com" });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe("1");
        });
    });
});