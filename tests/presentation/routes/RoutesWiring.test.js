import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import LoginRouter from "../../../src/presentation/routes/auth/LoginRouter.js";
import LogOffRouter from "../../../src/presentation/routes/auth/LogOffRouter.js";
import RefreshRouter from "../../../src/presentation/routes/auth/RefreshRouter.js";
import CreateUserRouter from "../../../src/presentation/routes/user/CreateUserRouter.js";
import GetProfileRouter from "../../../src/presentation/routes/user/GetProfileRouter.js";

describe("Testes de Apresentacao: Routes wiring", () => {
    let router;
    let rateLimit;
    let validator;
    let auth;
    let controller;

    beforeEach(() => {
        router = {
            post: jest.fn(),
            get: jest.fn()
        };
        rateLimit = {
            execute: jest.fn(() => "rate-limit-middleware")
        };
        validator = {
            bodyValidation: jest.fn(() => "body-validation-middleware"),
            cookiesValidation: jest.fn(() => "cookies-validation-middleware")
        };
        auth = {
            execute: jest.fn(() => "auth-middleware")
        };
        controller = {
            handle: jest.fn()
        };
    });

    test("LoginRouter deve usar validacao de body", () => {
        new LoginRouter({ router, rateLimit, validator, controller }).init();

        expect(rateLimit.execute).toHaveBeenCalledWith({ limit: 10, minutes: 1, prefix: "login" });
        expect(validator.bodyValidation).toHaveBeenCalledWith({ schemaName: "LOGIN" });
        expect(router.post).toHaveBeenCalledWith(
            "/login",
            "rate-limit-middleware",
            "body-validation-middleware",
            expect.any(Function)
        );
    });

    test("LogOffRouter deve usar validacao de cookies", () => {
        new LogOffRouter({ router, validator, controller }).init();

        expect(validator.cookiesValidation).toHaveBeenCalledWith({ schemaName: "REFRESH" });
        expect(router.post).toHaveBeenCalledWith(
            "/logout",
            "cookies-validation-middleware",
            expect.any(Function)
        );
    });

    test("RefreshRouter deve usar rate limit e validacao de cookies", () => {
        new RefreshRouter({ router, rateLimit, validator, controller }).init();

        expect(rateLimit.execute).toHaveBeenCalledWith({ limit: 10, minutes: 1, prefix: "refresh" });
        expect(validator.cookiesValidation).toHaveBeenCalledWith({ schemaName: "REFRESH" });
        expect(router.post).toHaveBeenCalledWith(
            "/refresh",
            "rate-limit-middleware",
            "cookies-validation-middleware",
            expect.any(Function)
        );
    });

    test("CreateUserRouter deve usar validacao de body", () => {
        new CreateUserRouter({ router, rateLimit, validator, controller }).init();

        expect(rateLimit.execute).toHaveBeenCalledWith({ limit: 5, minutes: 5, prefix: "register" });
        expect(validator.bodyValidation).toHaveBeenCalledWith({ schemaName: "USER_REGISTER" });
        expect(router.post).toHaveBeenCalledWith(
            "/user/register",
            "rate-limit-middleware",
            "body-validation-middleware",
            expect.any(Function)
        );
    });

    test("GetProfileRouter deve autenticar antes de validar o perfil", () => {
        new GetProfileRouter({ router, rateLimit, validator, auth, controller }).init();

        expect(rateLimit.execute).toHaveBeenCalledWith({ limit: 5, minutes: 5, prefix: "profile" });
        expect(auth.execute).toHaveBeenCalled();
        expect(validator.bodyValidation).toHaveBeenCalledWith({ schemaName: "USER_PROFILE" });
        expect(router.get).toHaveBeenCalledWith(
            "/user/me",
            "rate-limit-middleware",
            "auth-middleware",
            expect.any(Function),
            "body-validation-middleware",
            expect.any(Function)
        );
    });
});
