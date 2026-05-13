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
            const email = new EmailValueObject({ value: "valido@email.com" });
            expect(email.value).toBe("valido@email.com");
        });

        test("Deve lançar InvalidEmailError para e-mail inválido", () => {
            expect(() => new EmailValueObject({ value: "invalido" }))
                .toThrow(InvalidEmailError);
        });
    });

    describe("NameValueObject", () => {
        test("Deve criar um nome válido", () => {
            const name = new NameValueObject({ value: "Nome Válido" });
            expect(name.value).toBe("Nome Válido");
        });

        test("Deve lançar InvalidNameError para nome muito curto", () => {
            expect(() => new NameValueObject({ value: "Ab" }))
                .toThrow(InvalidNameError);
        });
    });

    describe("PasswordValueObject", () => {
        test("Deve criar uma senha válida", () => {
            const password = new PasswordValueObject({ value: "SenhaValida@123" });
            expect(password.value).toBe("SenhaValida@123");
        });

        test("Deve lançar InvalidPasswordError para senha fraca", () => {
            expect(() => new PasswordValueObject({ value: "123" }))
                .toThrow(InvalidPasswordError);
        });

        test("Deve aceitar senha já hasheada sem validação de regex", () => {
            const password = new PasswordValueObject({ value: "any_hash", alreadyHashed: true });
            expect(password.value).toBe("any_hash");
        });
    });
});
