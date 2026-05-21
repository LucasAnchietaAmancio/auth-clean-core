import { describe, test, expect } from "@jest/globals";
import { z } from "zod";
import ZodValidatorProvider from "../../../src/infra/providers/schema/ZodValidatorProvider.js";
import InvalidSchemaError from "../../../src/infra/errors/InvalidSchemaError.js";
import InternalServerError from "../../../src/infra/errors/InternalServerError.js";

describe("Testes de Infraestrutura: ZodValidatorProvider", () => {
    const sut = new ZodValidatorProvider({ zod: z });

    test("Deve validar dados corretamente usando schemaName", () => {
        const validData = {
            name: "Lucas",
            email: "lucas@email.com",
            password: "SenhaValida123"
        };

        const result = sut.validate({ value: validData, schemaName: "USER_REGISTER" });

        expect(result).toEqual(validData);
    });

    test("Deve lançar InvalidSchemaError para dados inválidos", () => {
        expect(() => {
            sut.validate({ value: { email: "lucas@email.com" }, schemaName: "USER_REGISTER" });
        }).toThrow(InvalidSchemaError);
    });

    test("Deve lançar InternalServerError caso o schemaName não exista", () => {
        expect(() => {
            sut.validate({ value: {}, schemaName: "NON_EXISTENT" });
        }).toThrow(InternalServerError);
    });
});
