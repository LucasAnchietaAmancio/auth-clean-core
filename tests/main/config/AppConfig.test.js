import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import AppConfig from "../../../src/main/config/app.js";
import openApiSpecification from "../../../src/main/config/openapi.js";

describe("Main config: AppConfig documentation", () => {
    let app;
    let express;
    let cors;
    let rateLimit;
    let cookieParser;
    let sut;

    beforeEach(() => {
        app = {
            use: jest.fn(),
            get: jest.fn()
        };

        express = {
            json: jest.fn(() => "json-middleware")
        };

        cors = jest.fn(() => "cors-middleware");
        rateLimit = jest.fn(() => "global-rate-limit-middleware");
        cookieParser = jest.fn(() => "cookie-parser-middleware");

        sut = new AppConfig({
            app,
            envs: {
                jwt: {}
            },
            express,
            db: {},
            redisClient: {},
            cors,
            rateLimit,
            redisStore: {},
            cookieParser
        });
    });

    test("deve expor a documentacao em /docs e o JSON bruto em /docs/openapi.json", () => {
        sut.setupDocumentation();

        expect(app.get).toHaveBeenCalledWith("/docs/openapi.json", expect.any(Function));
        expect(app.use).toHaveBeenCalledWith("/docs", expect.anything(), expect.any(Function));

        const handler = app.get.mock.calls[0][1];
        const res = {
            json: jest.fn()
        };

        handler({}, res);

        expect(res.json).toHaveBeenCalledWith(openApiSpecification);
        expect(openApiSpecification.externalDocs).toEqual({
            description: "Swagger UI",
            url: "/docs"
        });
    });

    test("deve registrar a documentacao antes do rate limit global", () => {
        sut.setupGlobalMiddlewares();
        sut.setupDocumentation();
        sut.setupRateLimit();

        expect(app.use.mock.calls[0][0]).toBe("cors-middleware");
        expect(app.use.mock.calls[1][0]).toBe("json-middleware");
        expect(app.use.mock.calls[2][0]).toBe("cookie-parser-middleware");
        expect(app.use.mock.calls[3][0]).toBe("/docs");
        expect(app.use.mock.calls[4][0]).toBe("global-rate-limit-middleware");
    });
});
