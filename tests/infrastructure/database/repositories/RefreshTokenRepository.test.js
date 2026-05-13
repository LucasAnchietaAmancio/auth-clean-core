import { describe, jest, test, expect } from "@jest/globals";
import RefreshTokenRepository from "../../../../src/infra/db/repositories/RefreshTokenRepository.js";
import RefreshTokenEntity from "../../../../src/domain/entities/RefreshTokenEntity.js";
import DatabaseError from "../../../../src/infra/errors/DatabaseError.js";

describe("Testes de Infraestrutura: RefreshTokenRepository", () => {
    
    const prismaMock = {
        refresh_tokens: {
            create: jest.fn(),
            findUnique: jest.fn(),
            deleteMany: jest.fn(),
            delete: jest.fn(),
        }
    };

    const dbWrapperMock = {
        getClient: jest.fn().mockResolvedValue(prismaMock)
    };

    const sut = new RefreshTokenRepository({ db: dbWrapperMock });

    describe("Validação do método 'create':", () => {
        test("Deve chamar o prisma.create com os dados corretos e retornar a entidade", async () => {
            const entity = new RefreshTokenEntity({
                userId: 1,
                token: "token-test",
                jti: "jti-test",
                expiresAt: 123456789
            });

            prismaMock.refresh_tokens.create.mockResolvedValue({
                id_refresh_token: 100,
                userId: 1,
                token: "token-test",
                jti: "jti-test",
                expiresAt: 123456789
            });

            const result = await sut.create({ refreshTokenEntity: entity });

            expect(result).toBeInstanceOf(RefreshTokenEntity);
            expect(result.id).toBe(100);
        });

        test("Deve lançar DatabaseError em caso de falha no banco", async () => {
            prismaMock.refresh_tokens.create.mockRejectedValue(new Error("DB Fail"));
            const entity = new RefreshTokenEntity({ userId: 1, token: "t", jti: "j", expiresAt: 1 });

            await expect(sut.create({ refreshTokenEntity: entity }))
                .rejects.toThrow(DatabaseError);
        });
    });

    describe("Validação do método 'findByToken':", () => {
        test("Deve retornar a entidade quando o token for encontrado", async () => {
            prismaMock.refresh_tokens.findUnique.mockResolvedValue({
                id_refresh_token: 100,
                userId: 1,
                token: "token-existente",
                jti: "jti-test",
                expiresAt: 123456789
            });

            const result = await sut.findByToken({ token: "token-existente" });

            expect(result).toBeInstanceOf(RefreshTokenEntity);
            expect(result.token).toBe("token-existente");
        });

        test("Deve retornar null quando o token não for encontrado", async () => {
            prismaMock.refresh_tokens.findUnique.mockResolvedValue(null);

            const result = await sut.findByToken({ token: "token-inexistente" });

            expect(result).toBeNull();
        });
    });
});
