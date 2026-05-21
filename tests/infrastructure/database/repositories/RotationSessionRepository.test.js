import { describe, jest, test, expect } from "@jest/globals";
import SessionRepository from "../../../../src/infra/db/repositories/SessionRepository.js";
import SessionEntity from "../../../../src/domain/entities/SessionEntity.js";
import DatabaseError from "../../../../src/infra/errors/DatabaseError.js";

describe("Testes de Infraestrutura: SessionRepository", () => {
    
    const prismaMock = {
        sessions: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    };

    const dbWrapperMock = {
        getClient: jest.fn().mockResolvedValue(prismaMock)
    };

    const sut = new SessionRepository({ db: dbWrapperMock });

    describe("Validação do método 'save':", () => {
        test("Deve chamar o prisma.create com os dados corretos e retornar a entidade", async () => {
            const entity = SessionEntity.create({
                idUser: 1,
                token: "token-test",
                jti: "jti-test",
                expiresAt: 123456789
            });

            prismaMock.sessions.create.mockResolvedValue({
                id_session: 100,
                id_user: 1,
                token: "token-test",
                jti: "jti-test",
                expires_at: 123456789
            });

            const result = await sut.save({ sessionEntity: entity });

            expect(prismaMock.sessions.create).toHaveBeenCalledWith({
                data: {
                    id_user: 1,
                    token: "token-test",
                    jti: "jti-test",
                    expires_at: 123456789
                }
            });
            expect(result).toBeInstanceOf(SessionEntity);
            expect(result.idSession).toBe(100);
        });

        test("Deve lançar DatabaseError em caso de falha no banco", async () => {
            prismaMock.sessions.create.mockRejectedValue(new Error("DB Fail"));
            const entity = SessionEntity.create({ idUser: 1, token: "t", jti: "j", expiresAt: 1 });

            await expect(sut.save({ sessionEntity: entity }))
                .rejects.toThrow(DatabaseError);
        });
    });

    describe("Validação do método 'findByJti':", () => {
        test("Deve retornar a entidade quando o jti for encontrado", async () => {
            prismaMock.sessions.findUnique.mockResolvedValue({
                id_session: 100,
                id_user: 1,
                token: "token-existente",
                jti: "jti-test",
                expires_at: 123456789
            });

            const result = await sut.findByJti({ jti: "jti-test" });

            expect(result).toBeInstanceOf(SessionEntity);
            expect(result.jti).toBe("jti-test");
        });

        test("Deve retornar null quando o jti não for encontrado", async () => {
            prismaMock.sessions.findUnique.mockResolvedValue(null);

            const result = await sut.findByJti({ jti: "jti-inexistente" });

            expect(result).toBeNull();
        });
    });
});
