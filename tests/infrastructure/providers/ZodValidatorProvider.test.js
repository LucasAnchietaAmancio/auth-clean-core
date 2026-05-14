import { describe, test, expect } from "@jest/globals";
import { z } from "zod";
import ZodValidatorProvider from "../../../src/infra/providers/schema/ZodValidatorProvider.js";
import InvalidSchemaError from "../../../src/infra/errors/InvalidSchemaError.js";
import InternalServerError from "../../../src/infra/errors/InternalServerError.js";

describe("Testes de Infraestrutura: ZodValidatorProvider", () => {
    const testSchema = z.object({
        email: z.string().email(),
        age: z.number().min(18)
    });

    const catalogMock = {
        "TEST_SCHEMA": testSchema
    };

    const sut = new ZodValidatorProvider({ catalog: catalogMock });

    test("Deve validar dados corretamente usando o nome do schema no catálogo", () => {
        const validData = { email: "test@email.com", age: 20 };
        const result = sut.validate({ value: validData, schemaName: "TEST_SCHEMA" });
        expect(result).toEqual(validData);
    });

    test("Deve lançar InvalidSchemaError para dados inválidos", () => {
        const invalidData = { email: "wrong-email", age: 10 };

        expect(() => {
            sut.validate({ value: invalidData, schemaName: "TEST_SCHEMA" });
        }).toThrow(InvalidSchemaError);
    });

    test("Deve lançar InternalServerError caso o schemaName não exista no catálogo", () => {
        expect(() => {
            sut.validate({ value: {}, schemaName: "NON_EXISTENT" });
        }).toThrow(InternalServerError);
    });
});
