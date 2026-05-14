import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import AppConfig from "./config/app.js";
import Env from "./config/env.js";
import PrismaClientWrapper from "../infra/db/prisma/PrismaClient.js";
import RedisClientWrapper from "../infra/db/redis/RedisClient.js";

const envs = new Env();
const db = new PrismaClientWrapper({ prismaClient: PrismaClient, envs });
const redisClient = new RedisClientWrapper({ createClientRedis: createClient, envs });

const app = express();

const appConfig = new AppConfig({
    app,
    express,
    envs,
    db,
    redisClient,
    cors,
    rateLimit,
    redisStore: RedisStore
});

appConfig.init();

app.listen(envs.server.port, () => {
    console.log(`Server running ${envs.server.port}`);
});
