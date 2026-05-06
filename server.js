import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./src/presentation/routes/user/UserRouter.js";
import authRouter from "./src/presentation/routes/auth/AuthRouter.js";
import ErrorHandlerMiddleware from "./src/presentation/middlewares/ErrorHandlerMiddleware.js";
import rateLimit from "express-rate-limit";
import PresentationErrors from "./src/presentation/errors/PresentationErrors.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    legacyHeaders: false,
});

app.use(globalLimiter);

app.use("/v1", authRouter);
app.use("/v1", userRouter);

app.use((req, res, next) => {
    next(PresentationErrors.notFound({
        message: "Rota não encontrada",
        description: `A rota ${req.method} ${req.originalUrl} não existe nesta API.`
    }));
});

app.use(ErrorHandlerMiddleware.execute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
