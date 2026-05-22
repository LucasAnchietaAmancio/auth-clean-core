import { Router } from "express";
import CreateUserRouter from "../../presentation/routes/user/CreateUserRouter.js";
import GetProfileRouter from "../../presentation/routes/user/GetProfileRouter.js";
import LoginRouter from "../../presentation/routes/auth/LoginRouter.js";
import LogOffRouter from "../../presentation/routes/auth/LogOffRouter.js";
import RefreshRouter from "../../presentation/routes/auth/RefreshRouter.js";

import ErrorHandlerMiddleware from "../../presentation/middlewares/ErrorHandlerMiddleware.js";
import RouteNotFoundError from "../../presentation/errors/RouteNotFoundError.js";

import { makeCreateUserController } from "../factories/controllers/makeCreateUserController.js";
import { makeGetProfileController } from "../factories/controllers/makeGetProfileController.js";
import { makeLoginController } from "../factories/controllers/makeLoginController.js";
import { makeLogoutController } from "../factories/controllers/makeLogoutController.js";
import { makeRotationSessionController } from "../factories/controllers/makeRotationSessionController.js";

import { makeAuthMiddleware } from "../factories/middlewares/makeAuthMiddleware.js";
import { makeRateLimitMiddleware } from "../factories/middlewares/makeRateLimitMiddleware.js";
import { makeValidationSchemaMiddleware } from "../factories/middlewares/makeValidationSchemaMiddleware.js";

export default class AppConfig {
    constructor({ app, envs, express, db, redisClient, cors, rateLimit, redisStore, cookieParser }) {
        this.app = app;
        this.envs = envs;
        this.express = express;
        this.db = db;
        this.redisClient = redisClient;
        this.cors = cors;
        this.rateLimit = rateLimit;
        this.redisStore = redisStore;
        this.cookieParser = cookieParser;
    }

    setupGlobalMiddlewares() {
        this.app.use(this.cors());
        this.app.use(this.express.json({ limit: "10kb" }));
        this.app.use(this.cookieParser());
    }

    setupRateLimit() {
        const globalLimiter = this.rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 200,
            legacyHeaders: false
        });

        this.app.use(globalLimiter);
    }

    setupRoutes() {
        const makeLimiter = () => makeRateLimitMiddleware({
            redisClient: this.redisClient,
            rateLimit: this.rateLimit,
            redisStore: this.redisStore
        });

        const loginRouter = new LoginRouter({
            router: Router(),
            rateLimit: makeLimiter(),
            validator: makeValidationSchemaMiddleware(),
            controller: makeLoginController({ envs: this.envs, db: this.db })
        });

        const logOffRouter = new LogOffRouter({
            router: Router(),
            validator: makeValidationSchemaMiddleware(),
            controller: makeLogoutController({ envs: this.envs, db: this.db })
        });

        const refreshRouter = new RefreshRouter({
            router: Router(),
            rateLimit: makeLimiter(),
            validator: makeValidationSchemaMiddleware(),
            controller: makeRotationSessionController({ envs: this.envs, db: this.db })
        });

        const createUserRouter = new CreateUserRouter({
            router: Router(),
            rateLimit: makeLimiter(),
            validator: makeValidationSchemaMiddleware(),
            controller: makeCreateUserController({ envs: this.envs, db: this.db })
        });

        const getProfileRouter = new GetProfileRouter({
            router: Router(),
            rateLimit: makeLimiter(),
            validator: makeValidationSchemaMiddleware(),
            auth: makeAuthMiddleware({ envs: this.envs, db: this.db }),
            controller: makeGetProfileController({ db: this.db })
        });

        this.app.use("/v1", loginRouter.init());
        this.app.use("/v1", logOffRouter.init());
        this.app.use("/v1", refreshRouter.init());
        this.app.use("/v1", createUserRouter.init());
        this.app.use("/v1", getProfileRouter.init());
    }

    setupErrorHandlers() {
        this.app.use((req, res, next) => {
            next(new RouteNotFoundError({
                originalError: `Rota ${req.method} ${req.originalUrl} não encontrada`
            }));
        });

        this.app.use(ErrorHandlerMiddleware.execute);
    }

    init() {
        this.setupGlobalMiddlewares();
        this.setupRateLimit();
        this.setupRoutes();
        this.setupErrorHandlers();
    }
}
