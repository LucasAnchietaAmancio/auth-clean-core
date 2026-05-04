import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/presentation/routes/AuthRoutes.js";

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

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
