import UserEntity from "../../src/domain/UserEntity.js";
import DomainErros from "../../src/domain/erros/DomainErros.js";

describe("Testes de Domínio: UserEntity", () => {
    const dadosUsuarioValidos = {
        name: "João Silva",
        email: "joao@exemplo.com.br",
        password: "SenhaForte123#"
    };

    test("Deve criar uma entidade de usuário válida", () => {
        const usuario = new UserEntity(dadosUsuarioValidos);
        expect(usuario.name.value).toBe(dadosUsuarioValidos.name);
        expect(usuario.email.value).toBe(dadosUsuarioValidos.email);
        expect(usuario.password.value).toBe(dadosUsuarioValidos.password);
    });

    describe("Validações de Nome", () => {
        test("Deve lançar erro se o nome estiver vazio", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, name: "" }))
                .toThrow(DomainErros);
        });

        test("Deve lançar erro se o nome tiver menos de 3 caracteres", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, name: "Jo" }))
                .toThrow("Nome inválido, deve ter pelo menos 3 caracteres");
        });
    });

    describe("Validações de E-mail", () => {
        test("Deve lançar erro se o e-mail for inválido", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, email: "email-invalido" }))
                .toThrow("Email inválido, digite um email válido");
        });

        test("Deve lançar erro se o e-mail não tiver domínio completo", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, email: "joao@com" }))
                .toThrow("Email inválido, digite um email válido");
        });
    });

    describe("Validações de Senha", () => {
        test("Deve lançar erro se a senha for muito curta", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, password: "Sen1#" }))
                .toThrow("no mínimo 8 caracteres");
        });

        test("Deve lançar erro se a senha não tiver caractere especial", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, password: "SenhaForte123" }))
                .toThrow("caractere especial");
        });

        test("Deve lançar erro se a senha não tiver um número", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, password: "SenhaForte#@" }))
                .toThrow("um número");
        });

        test("Deve lançar erro se a senha não tiver letra maiúscula", () => {
            expect(() => new UserEntity({ ...dadosUsuarioValidos, password: "senhaforte123#" }))
                .toThrow("letra maiúscula");
        });
    });
});
