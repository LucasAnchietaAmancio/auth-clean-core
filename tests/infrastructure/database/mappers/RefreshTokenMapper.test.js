import RefreshTokenMapper from "../../../../src/infra/db/mappers/RefreshTokenMapper.js";
import RefreshTokenEntity from "../../../../src/domain/entities/RefreshTokenEntity.js";

describe("Testes de Infraestrutura: RefreshTokenMapper", () => {
    
    const mockRecord = {
        id_refresh_token: 1,
        userId: 10,
        token: "jwt-token-string",
        jti: "jti-uuid",
        expiresAt: 1234567890,
        createdAt: new Date()
    };

    describe("Validação do método 'toDomain':", () => {
        test("Deve converter um registro do banco para uma entidade de domínio corretamente", () => {
            const result = RefreshTokenMapper.toDomain(mockRecord);

            expect(result).toBeInstanceOf(RefreshTokenEntity);
            expect(result.id).toBe(mockRecord.id_refresh_token);
            expect(result.userId).toBe(mockRecord.userId);
            expect(result.token).toBe(mockRecord.token);
            expect(result.jti).toBe(mockRecord.jti);
            expect(result.expiresAt).toBe(mockRecord.expiresAt);
        });

        test("Deve retornar null caso o registro seja nulo ou indefinido", () => {
            expect(RefreshTokenMapper.toDomain(null)).toBeNull();
            expect(RefreshTokenMapper.toDomain(undefined)).toBeNull();
        });
    });
});
