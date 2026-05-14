import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./src/presentation/routes/user/UserRouter.js";
import authRouter from "./src/presentation/routes/auth/AuthRouter.js";
import ErrorHandlerMiddleware from "./src/presentation/middlewares/ErrorHandlerMiddleware.js";
import rateLimit from "express-rate-limit";
import Envs from "./src/main/config/env.js";
import RouteNotFoundError from "./src/presentation/errors/RouteNotFoundError.js";

const app = express();
const envs = new Envs();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    legacyHeaders: false,
});

app.use(globalLimiter);

app.use("/v1", authRouter);
app.use("/v1", userRouter);

app.use((req, res, next) => {
    next(new RouteNotFoundError({ originalError: `Rota ${req.method} ${req.originalUrl} não encontrada` }));
});

app.use(ErrorHandlerMiddleware.execute);

app.listen(envs.server.port, () => {
    console.log(`Server running on port ${envs.server.port}`);
});
