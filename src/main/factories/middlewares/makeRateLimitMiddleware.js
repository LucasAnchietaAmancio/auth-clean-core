import { createClient } from "redis";
import RedisClient from "../../../infra/db/redis/RedisClient.js";
import RateLimitMiddleware from "../../../presentation/middlewares/RateLimitMiddleware.js";
import Envs from "../../config/env.js";

export const makeRateLimitMiddleware = () => {
    const envs = new Envs();
    const redisClient = new RedisClient({ createClientRedis: createClient, envs });

    return new RateLimitMiddleware({ redisClient, envs });
};
