import UserRepository from "../../../../src/infra/db/repositories/UserRepository.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";
import { jest } from "@jest/globals";

describe("Testes de Infraestrutura: UserRepository", () => {
    const dbMock = {
        users: {
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
            dbMock.users.create.mockResolvedValue({
                id_user: 1,
                name: "Lucas",
                email: "lucas@email.com",
                password: "$2b$12$NygFN5roLN2CfhB3GUsWgO53sm7dgP3Y8zgMZcJCCND1HEtRposci",
                createdAt: "2024-10-27T10:00:00.000Z",
                updatedAt: "2024-10-27T10:00:00.000Z"
            });

            const result = await sutUserRepository.create({ user: UserEntityExample });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(1);
            expect(result.email.value).toBe("lucas@email.com");
        });

        test("Deve lançar um erro caso o usuário já exista", async () => {
            dbMock.users.create.mockRejectedValue({
                code: "P2002"
            });

            await expect(sutUserRepository.create({ user: UserEntityExample }))
                .rejects.toThrow("Erro ao criar usuário");
        });
    });

    describe("Validação da implementação do método 'findByEmail':", () => {
        test("Deve buscar um usuário no banco de dados, retornando a Entidade de Domínio", async () => {
            dbMock.users.findUnique.mockResolvedValue({
                id_user: 1,
                name: "Lucas",
                email: "lucas@email.com",
                password: "$2b$12$NygFN5roLN2CfhB3GUsWgO53sm7dgP3Y8zgMZcJCCND1HEtRposci",
                createdAt: "2024-10-27T10:00:00.000Z",
                updatedAt: "2024-10-27T10:00:00.000Z"
            });

            const result = await sutUserRepository.findByEmail({ email: "lucas@email.com" });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(1);
        });
    });
});