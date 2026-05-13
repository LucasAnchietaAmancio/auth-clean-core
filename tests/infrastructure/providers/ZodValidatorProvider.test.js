import { describe, test, expect } from "@jest/globals";
import { z } from "zod";
import ZodValidatorProvider from "../../../src/infra/providers/schema/ZodValidatorProvider.js";
import InvalidSchemaError from "../../../src/infra/errors/InvalidSchemaError.js";

describe("Testes de Infraestrutura: ZodValidatorProvider", () => {
    const sut = new ZodValidatorProvider();

    const testSchema = z.object({
        email: z.string().email(),
        age: z.number().min(18)
    });

    test("Deve validar dados corretamente", () => {
        const validData = { email: "test@email.com", age: 20 };
        const result = sut.validate({ value: validData, schema: testSchema });
        expect(result).toEqual(validData);
    });

    test("Deve lançar InvalidSchemaError para dados inválidos", () => {
        const invalidData = { email: "wrong-email", age: 10 };
        
        expect(() => {
            sut.validate({ value: invalidData, schema: testSchema });
        }).toThrow(InvalidSchemaError);

        try {
            sut.validate({ value: invalidData, schema: testSchema });
        } catch (error) {
            expect(error.metadata).toBeDefined();
            expect(error.metadata.cause).toBeDefined();
        }
    });
});
