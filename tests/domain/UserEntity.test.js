import UserEntity from "../../src/domain/UserEntity.js";

describe("Testes de Domínio: UserEntity", () => {
    let dataValid = {
        name: "João Silva",
        email: "lucas@gmail.com",
        password: "LucasAnchieta@2025"
    };

    test("Deve criar uma entidade de usuário válida", () => {
        expect(() => {
            return new UserEntity(dataValid);
        }).toBeTruthy();
    });

    describe("Validação de email", () => {

        test("Deve retornar um DomainError caso o email não tenha @", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas.gmail.com" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email não tenha .", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas@gmailcom" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email não contenha nada antes do @", () => {
            expect(() => new UserEntity({ ...dataValid, email: "@gmail.com" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email não contenha nada depois do @", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas@" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email seja um número", () => {
            expect(() => new UserEntity({ ...dataValid, email: 12345 }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email seja null", () => {
            expect(() => new UserEntity({ ...dataValid, email: null }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email esteja vazio", () => {
            expect(() => new UserEntity({ ...dataValid, email: "" }))
                .toThrow("Email inválido");
        });
    });

    describe("Validação de nome", () => {
        test("Deve retornar um DomainError caso o nome seja menor que 3 caracteres", () => {
            expect(() => new UserEntity({ ...dataValid, name: "jo" }))
                .toThrow("Nome inválido");
        });

        test("Deve retornar um DomainError caso o nome seja null", () => {
            expect(() => new UserEntity({ ...dataValid, name: null }))
                .toThrow("Nome inválido");
        });

        test("Deve retornar um DomainError caso o nome esteja vazio", () => {
            expect(() => new UserEntity({ ...dataValid, name: "" }))
                .toThrow("Nome inválido");
        });
    });

    describe("Validação de senha", () => {
        test("Deve retornar um DomainError caso a senha seja menor que 8 caracteres", () => {
            expect(() => new UserEntity({ ...dataValid, password: "123" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha seja null", () => {
            expect(() => new UserEntity({ ...dataValid, password: null }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha esteja vazia", () => {
            expect(() => new UserEntity({ ...dataValid, password: "" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha número", () => {
            expect(() => new UserEntity({ ...dataValid, password: "LucasAnchieta@" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha letra maiúscula", () => {
            expect(() => new UserEntity({ ...dataValid, password: "lucasanchieta@2025" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha letra minúscula", () => {
            expect(() => new UserEntity({ ...dataValid, password: "LUCASANCHIETA@2025" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha caractere especial", () => {
            expect(() => new UserEntity({ ...dataValid, password: "LucasAnchieta2025" }))
                .toThrow("Senha inválida");
        });
    });
});