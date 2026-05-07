import RefreshTokenEntity from "../../src/domain/entities/RefreshTokenEntity.js";

describe("Testes de Domínio: RefreshTokenEntity", () => {
    const expiresAtValid = Math.floor(Date.now() / 1000) + 1000;
    
    let dataValid = {
        userId: 1,
        token: "valid-token-uuid",
        jti: "valid-jti-uuid",
        expiresAt: expiresAtValid
    };

    describe("Validação da implementação do método 'constructor':", () => {
        test("Deve criar uma entidade de refresh token válida, retornando a instância sem erros", () => {
            expect(() => {
                new RefreshTokenEntity(dataValid);
            }).not.toThrow();
        });

        test("Deve garantir que os dados atribuídos no constructor estão corretos", () => {
            const refreshToken = new RefreshTokenEntity(dataValid);
            expect(refreshToken.userId).toBe(dataValid.userId);
            expect(refreshToken.token).toBe(dataValid.token);
            expect(refreshToken.jti).toBe(dataValid.jti);
            expect(refreshToken.expiresAt).toBe(dataValid.expiresAt);
        });
    });

    describe("Validação da implementação do método 'isExpired':", () => {
        test("Deve retornar falso caso o token ainda não tenha expirado", () => {
            const refreshToken = new RefreshTokenEntity(dataValid);
            expect(refreshToken.isExpired()).toBe(false);
        });

        test("Deve retornar verdadeiro caso o token já tenha expirado", () => {
            const expiresAtPast = Math.floor(Date.now() / 1000) - 1000;
            const refreshToken = new RefreshTokenEntity({ 
                ...dataValid, 
                expiresAt: expiresAtPast 
            });
            expect(refreshToken.isExpired()).toBe(true);
        });
    });
});
