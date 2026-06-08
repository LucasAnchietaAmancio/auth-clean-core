import { describe, test, expect } from "@jest/globals";
import EmailValueObject from "../../../src/domain/value-objects/EmailValueObject.js";
import NameValueObject from "../../../src/domain/value-objects/NameValueObject.js";
import PasswordValueObject from "../../../src/domain/value-objects/PasswordValueObject.js";
import InvalidEmailError from "../../../src/domain/errors/InvalidEmailError.js";
import InvalidNameError from "../../../src/domain/errors/InvalidNameError.js";
import InvalidPasswordError from "../../../src/domain/errors/InvalidPasswordError.js";

describe("Testes de Domínio: Value Objects", () => {

    describe("EmailValueObject", () => {
        test("Deve criar um e-mail válido", () => {
            const email = EmailValueObject.create({ email: "valido@email.com" });
            expect(email.value).toBe("valido@email.com");
        });

        test("Deve lançar InvalidEmailError para e-mail inválido", () => {
            expect(() => EmailValueObject.create({ email: "invalido" }))
                .toThrow(InvalidEmailError);
        });
    });

    describe("NameValueObject", () => {
        test("Deve criar um nome válido", () => {
            const name = NameValueObject.create({ name: "Nome Válido" });
            expect(name.value).toBe("Nome Válido");
        });

        test("Deve lançar InvalidNameError para nome muito curto", () => {
            expect(() => NameValueObject.create({ name: "Ab" }))
                .toThrow(InvalidNameError);
        });
    });

    describe("PasswordValueObject", () => {
        test("Deve criar uma senha válida", () => {
            const password = PasswordValueObject.create({ password: "SenhaValida@123" });
            expect(password.value).toBe("SenhaValida@123");
        });

        test("Deve lançar InvalidPasswordError para senha fraca", () => {
            expect(() => PasswordValueObject.create({ password: "123" }))
                .toThrow(InvalidPasswordError);
        });

        test("Deve aceitar senha já hasheada sem validação de regex", () => {
            const password = PasswordValueObject.restore({ hashedPassword: "any_hash" });
            expect(password.value).toBe("any_hash");
        });
    });
});
