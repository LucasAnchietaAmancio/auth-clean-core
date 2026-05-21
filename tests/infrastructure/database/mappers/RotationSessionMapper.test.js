import SessionMapper from "../../../../src/infra/db/mappers/SessionMapper.js";
import SessionEntity from "../../../../src/domain/entities/SessionEntity.js";

describe("Testes de Infraestrutura: SessionMapper", () => {
    
    const mockRecord = {
        id_session: 1,
        id_user: 10,
        token: "jwt-token-string",
        jti: "jti-uuid",
        expires_at: 1234567890,
        created_at: new Date()
    };

    describe("Validação do método 'toDomain':", () => {
        test("Deve converter um registro do banco para uma entidade de domínio corretamente", () => {
            const result = SessionMapper.toDomain(mockRecord);

            expect(result).toBeInstanceOf(SessionEntity);
            expect(result.idSession).toBe(mockRecord.id_session);
            expect(result.idUser).toBe(mockRecord.id_user);
            expect(result.token).toBe(mockRecord.token);
            expect(result.jti).toBe(mockRecord.jti);
            expect(result.expiresAt).toBe(mockRecord.expires_at);
        });

        test("Deve retornar null caso o registro seja nulo ou indefinido", () => {
            expect(SessionMapper.toDomain(null)).toBeNull();
            expect(SessionMapper.toDomain(undefined)).toBeNull();
        });
    });
});
