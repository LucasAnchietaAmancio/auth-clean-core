import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/presentation/routes/user/UserRoutes.js";

dotenv.config();

import rateLimit from "express-rate-limit";

const app = express();

app.use(cors());
app.use(express.json());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    legacyHeaders: false,
});

app.use(globalLimiter);

app.use("/api", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "P404",
            message: "Rota não encontrada",
            description: `O endpoint ${req.method} ${req.originalUrl} não existe nesta API.`
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
