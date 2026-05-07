import { describe, jest } from "@jest/globals";
import RefreshTokenRepository from "../../../../src/infra/db/repositories/RefreshTokenRepository.js";
import RefreshTokenEntity from "../../../../src/domain/entities/RefreshTokenEntity.js";

describe("Testes de Infraestrutura: RefreshTokenRepository", () => {
    
    const dbMock = {
        refresh_tokens: {
            create: jest.fn(),
            findUnique: jest.fn(),
            deleteMany: jest.fn(),
            delete: jest.fn(),
        }
    };

    const sut = new RefreshTokenRepository({ db: dbMock });

    describe("Validação do método 'create':", () => {
        test("Deve chamar o prisma.create com os dados corretos e retornar a entidade", async () => {
            const entity = new RefreshTokenEntity({
                userId: 1,
                token: "token-test",
                jti: "jti-test",
                expiresAt: 123456789
            });

            dbMock.refresh_tokens.create.mockResolvedValue({
                id_refresh_token: 100,
                userId: 1,
                token: "token-test",
                jti: "jti-test",
                expiresAt: 123456789
            });

            const result = await sut.create({ refreshTokenEntity: entity });

            expect(dbMock.refresh_tokens.create).toHaveBeenCalledWith({
                data: {
                    userId: 1,
                    token: "token-test",
                    jti: "jti-test",
                    expiresAt: 123456789
                }
            });
            expect(result).toBeInstanceOf(RefreshTokenEntity);
            expect(result.id).toBe(100);
        });
    });

    describe("Validação do método 'findByToken':", () => {
        test("Deve retornar a entidade quando o token for encontrado", async () => {
            dbMock.refresh_tokens.findUnique.mockResolvedValue({
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
            dbMock.refresh_tokens.findUnique.mockResolvedValue(null);

            const result = await sut.findByToken({ token: "token-inexistente" });

            expect(result).toBeNull();
        });
    });
});
