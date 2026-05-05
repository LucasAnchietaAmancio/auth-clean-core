import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./src/presentation/routes/user/UserRouter.js";
import authRouter from "./src/presentation/routes/auth/AuthRouter.js";
import ErrorHandler from "./src/presentation/middlewares/ErrorHandler.js";
import rateLimit from "express-rate-limit";

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

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "PN404",
            message: "Rota não encontrada",
            description: `O endpoint ${req.method} ${req.originalUrl} não existe nesta API.`,
            timestamp: new Date().toISOString()
        }
    });
});

app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
