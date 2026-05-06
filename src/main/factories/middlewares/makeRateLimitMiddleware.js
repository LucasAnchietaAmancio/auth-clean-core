import { createClient } from "redis";
import RedisClient from "../../../infra/db/redis/RedisClient.js";
import RateLimitMiddleware from "../../../presentation/middlewares/RateLimitMiddleware.js";

export const makeRateLimitMiddleware = () => {
    const redisClient = new RedisClient({ createClientRedis: createClient });
    return new RateLimitMiddleware({ redisClient });
};
