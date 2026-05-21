import { describe, test, expect } from "@jest/globals";
import { z } from "zod";
import ZodValidatorProvider from "../../../src/infra/providers/schema/ZodValidatorProvider.js";

describe("Testes de Schemas Zod por schemaName", () => {
    const sut = new ZodValidatorProvider({ zod: z });

    test("Deve validar LOGOFF quando refreshToken for fornecido", () => {
        const data = { refreshToken: "a".repeat(55) };
        const result = sut.validate({ value: data, schemaName: "LOGOFF" });

        expect(result).toEqual(data);
    });

    test("Deve validar REFRESH quando refreshToken for fornecido", () => {
        const data = { refreshToken: "b".repeat(55) };
        const result = sut.validate({ value: data, schemaName: "REFRESH" });

        expect(result).toEqual(data);
    });

    test("Deve falhar quando refreshToken estiver ausente", () => {
        expect(() => {
            sut.validate({ value: {}, schemaName: "REFRESH" });
        }).toThrow();
    });

    test("Deve converter idUser do perfil para number", () => {
        const result = sut.validate({
            value: { idUser: "1" },
            schemaName: "USER_PROFILE"
        });

        expect(result).toEqual({ idUser: 1 });
    });
});
