import SessionEntity from "../../src/domain/entities/SessionEntity.js";

describe("Testes de Domínio: SessionEntity", () => {
    const expiresAtValid = Math.floor(Date.now() / 1000) + 1000;
    
    let dataValid = {
        userId: 1,
        token: "valid-token-uuid",
        jti: "valid-jti-uuid",
        expiresAt: expiresAtValid
    };

    describe("Validação da implementação do método 'create':", () => {
        test("Deve criar uma entidade de sessão válida, retornando a instância sem erros", () => {
            expect(() => {
                SessionEntity.create(dataValid);
            }).not.toThrow();
        });

        test("Deve garantir que os dados atribuídos no create estão corretos", () => {
            const session = SessionEntity.create(dataValid);
            expect(session.userId).toBe(dataValid.userId);
            expect(session.token).toBe(dataValid.token);
            expect(session.jti).toBe(dataValid.jti);
            expect(session.expiresAt).toBe(dataValid.expiresAt);
        });
    });

    describe("Validação da implementação do método 'restore':", () => {
        test("Deve restaurar uma entidade de sessão com id", () => {
            const session = SessionEntity.restore({ id: 1, ...dataValid });
            expect(session.id).toBe(1);
            expect(session.userId).toBe(dataValid.userId);
        });

        test("Deve lançar erro ao restaurar com dados insuficientes", () => {
            expect(() => {
                SessionEntity.restore({ id: 1, userId: 1 });
            }).toThrow();
        });
    });
});
