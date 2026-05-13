import UserRepository from "../../../../src/infra/db/repositories/UserRepository.js";
import UserEntity from "../../../../src/domain/entities/UserEntity.js";
import DatabaseError from "../../../../src/infra/errors/DatabaseError.js";
import { describe, test, expect, jest } from "@jest/globals";

describe("Testes de Infraestrutura: UserRepository", () => {
    const prismaMock = {
        users: {
            create: jest.fn(),
            findUnique: jest.fn()
        }
    };

    const dbWrapperMock = {
        getClient: jest.fn().mockResolvedValue(prismaMock)
    };

    const sutUserRepository = new UserRepository({ db: dbWrapperMock });

    const UserEntityExample = new UserEntity({
        name: "Lucas",
        email: "lucas@email.com",
        password: "HashedPassword@123",
        alreadyHashed: true
    });

    describe("Validação da implementação do método 'create':", () => {
        test("Deve criar um usuário no banco de dados, retornando a Entidade de Domínio", async () => {
            prismaMock.users.create.mockResolvedValue({
                id_user: 1,
                name: "Lucas",
                email: "lucas@email.com",
                password: "HashedPassword@123",
                createdAt: "2024-10-27T10:00:00.000Z",
                updatedAt: "2024-10-27T10:00:00.000Z"
            });

            const result = await sutUserRepository.create({ user: UserEntityExample });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(1);
            expect(result.email.value).toBe("lucas@email.com");
        });

        test("Deve lançar um DatabaseError caso o Prisma retorne erro", async () => {
            prismaMock.users.create.mockRejectedValue(new Error("Prisma Error"));

            await expect(sutUserRepository.create({ user: UserEntityExample }))
                .rejects.toThrow(DatabaseError);
        });
    });

    describe("Validação da implementação do método 'findByEmail':", () => {
        test("Deve buscar um usuário no banco de dados, retornando a Entidade de Domínio", async () => {
            prismaMock.users.findUnique.mockResolvedValue({
                id_user: 1,
                name: "Lucas",
                email: "lucas@email.com",
                password: "HashedPassword@123",
                createdAt: "2024-10-27T10:00:00.000Z",
                updatedAt: "2024-10-27T10:00:00.000Z"
            });

            const result = await sutUserRepository.findByEmail({ email: "lucas@email.com" });

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(1);
        });
    });
});