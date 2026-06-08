import SessionEntity from "../../src/domain/entities/SessionEntity.js";

describe("Testes de Domínio: SessionEntity", () => {
    const expiresAtValid = Math.floor(Date.now() / 1000) + 1000;
    
    let dataValid = {
        idUser: 1,
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
            expect(session.idUser).toBe(dataValid.idUser);
            expect(session.token).toBe(dataValid.token);
            expect(session.jti).toBe(dataValid.jti);
            expect(session.expiresAt).toBe(dataValid.expiresAt);
        });
    });

    describe("Validação da implementação do método 'restore':", () => {
        test("Deve restaurar uma entidade de sessão com id", () => {
            const session = SessionEntity.restore({ idSession: 1, ...dataValid });
            expect(session.idSession).toBe(1);
            expect(session.idUser).toBe(dataValid.idUser);
        });

        test("Deve lançar erro ao restaurar com dados insuficientes", () => {
            expect(() => {
                SessionEntity.restore({ idSession: 1, idUser: 1 });
            }).toThrow();
        });
    });
});
