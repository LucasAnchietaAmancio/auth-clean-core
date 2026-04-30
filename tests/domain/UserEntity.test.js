import UserEntity from "../../src/domain/entities/UserEntity.js";

describe("Testes de Domínio: UserEntity", () => {

    let dataValid = {
        name: "João Silva",
        email: "lucas@gmail.com",
        password: "LucasAnchieta@2025"
    };

    describe("Validação da implementação do método 'constructor':", () => {
        test("Deve criar uma entidade de usuário válida, retornando a instância sem erros", () => {
            expect(() => {
                new UserEntity(dataValid);
            }).not.toThrow();
        });
    });

    describe("Validação da implementação do campo 'email':", () => {

        test("Deve retornar um DomainError caso o email não tenha @, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas.gmail.com" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email não tenha ., retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas@gmailcom" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email não contenha nada antes do @, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: "@gmail.com" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email não contenha nada depois do @, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas@" }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email seja um número, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: 12345 }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email seja null, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: null }))
                .toThrow("Email inválido");
        });

        test("Deve retornar um DomainError caso o email esteja vazio, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, email: "" }))
                .toThrow("Email inválido");
        });
    });

    describe("Validação da implementação do campo 'name':", () => {
        test("Deve retornar um DomainError caso o nome seja menor que 3 caracteres, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, name: "jo" }))
                .toThrow("Nome inválido");
        });

        test("Deve retornar um DomainError caso o nome seja null, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, name: null }))
                .toThrow("Nome inválido");
        });

        test("Deve retornar um DomainError caso o nome esteja vazio, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, name: "" }))
                .toThrow("Nome inválido");
        });
    });

    describe("Validação da implementação do campo 'password':", () => {
        test("Deve retornar um DomainError caso a senha seja menor que 8 caracteres, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: "123" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha seja null, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: null }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha esteja vazia, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: "" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha número, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: "LucasAnchieta@" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha letra maiúscula, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: "lucasanchieta@2025" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha letra minúscula, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: "LUCASANCHIETA@2025" }))
                .toThrow("Senha inválida");
        });

        test("Deve retornar um DomainError caso a senha não tenha caractere especial, retornando a exceção de validação", () => {
            expect(() => new UserEntity({ ...dataValid, password: "LucasAnchieta2025" }))
                .toThrow("Senha inválida");
        });
    });
});