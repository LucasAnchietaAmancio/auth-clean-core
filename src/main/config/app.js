import { Router } from "express";
import UserRouter from "../../presentation/routes/user/UserRouter.js";
import AuthRouter from "../../presentation/routes/auth/AuthRouter.js";
import RefreshRouter from "../../presentation/routes/auth/RefreshRouter.js";
import ErrorHandlerMiddleware from "../../presentation/middlewares/ErrorHandlerMiddleware.js";
import RouteNotFoundError from "../../presentation/errors/RouteNotFoundError.js";
import { makeLoginController } from "../factories/controllers/makeLoginController.js";
import { makeCreateUserController } from "../factories/controllers/makeCreateUserController.js";
import { makeRotationSessionController } from "../factories/controllers/makeRotationSessionController.js"
import { makeValidationSchemaMiddleware } from "../factories/middlewares/makeValidationSchemaMiddleware.js";
import { makeRateLimitMiddleware } from "../factories/middlewares/makeRateLimitMiddleware.js";

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
            legacyHeaders: false,
        });
        this.app.use(globalLimiter);
    }

    setupRoutes() {
        const validationMiddleware = makeValidationSchemaMiddleware();
        const rateLimitMiddleware = makeRateLimitMiddleware({ redisClient: this.redisClient, rateLimit: this.rateLimit, redisStore: this.redisStore });
        const rotationSessionController = makeRotationSessionController({ envs: this.envs, db: this.db });

        const refreshRouter = new RefreshRouter({
            router: Router(),
            rateLimit: rateLimitMiddleware,
            validateSchema: validationMiddleware,
            controller: rotationSessionController
        });

        const authRouter = new AuthRouter({
            router: Router(),
            rateLimit: rateLimitMiddleware,
            validateSchema: validationMiddleware,
            controller: makeLoginController({ envs: this.envs, db: this.db })
        });

        const userRouter = new UserRouter({
            router: Router(),
            rateLimit: rateLimitMiddleware,
            validateSchema: validationMiddleware,
            controller: makeCreateUserController({ envs: this.envs, db: this.db })
        });

        this.app.use("/v1", authRouter.init());
        this.app.use("/v1", userRouter.init());
        this.app.use("/v1", refreshRouter.init());
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
