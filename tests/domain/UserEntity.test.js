import UserEntity from "../../src/domain/entities/UserEntity.js";
import InvalidEmailError from "../../src/domain/errors/InvalidEmailError.js";
import InvalidNameError from "../../src/domain/errors/InvalidNameError.js";
import InvalidPasswordError from "../../src/domain/errors/InvalidPasswordError.js";
import { describe, test, expect } from "@jest/globals";

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

        test("Deve lançar InvalidEmailError caso o email não tenha @", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas.gmail.com" }))
                .toThrow(InvalidEmailError);
        });

        test("Deve lançar InvalidEmailError caso o email não tenha .", () => {
            expect(() => new UserEntity({ ...dataValid, email: "lucas@gmailcom" }))
                .toThrow(InvalidEmailError);
        });

        test("Deve lançar InvalidEmailError caso o email esteja mal formado", () => {
            expect(() => new UserEntity({ ...dataValid, email: "@gmail.com" }))
                .toThrow(InvalidEmailError);
        });

        test("Deve lançar InvalidEmailError caso o email seja null ou vazio", () => {
            expect(() => new UserEntity({ ...dataValid, email: null }))
                .toThrow(InvalidEmailError);
            expect(() => new UserEntity({ ...dataValid, email: "" }))
                .toThrow(InvalidEmailError);
        });
    });

    describe("Validação da implementação do campo 'name':", () => {
        test("Deve lançar InvalidNameError caso o nome seja inválido", () => {
            expect(() => new UserEntity({ ...dataValid, name: "jo" }))
                .toThrow(InvalidNameError);
            expect(() => new UserEntity({ ...dataValid, name: null }))
                .toThrow(InvalidNameError);
        });
    });

    describe("Validação da implementação do campo 'password':", () => {
        test("Deve lançar InvalidPasswordError para senhas que não seguem o padrão de segurança", () => {
            expect(() => new UserEntity({ ...dataValid, password: "123" }))
                .toThrow(InvalidPasswordError);
            expect(() => new UserEntity({ ...dataValid, password: "lucasanchieta@2025" }))
                .toThrow(InvalidPasswordError);
            expect(() => new UserEntity({ ...dataValid, password: "LucasAnchieta2025" }))
                .toThrow(InvalidPasswordError);
        });

        test("Deve lançar InvalidPasswordError caso a senha seja null ou vazia", () => {
            expect(() => new UserEntity({ ...dataValid, password: null }))
                .toThrow(InvalidPasswordError);
            expect(() => new UserEntity({ ...dataValid, password: "" }))
                .toThrow(InvalidPasswordError);
        });
    });
});