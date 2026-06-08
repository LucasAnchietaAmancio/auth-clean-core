import RateLimitMiddleware from "../../../presentation/middlewares/auth/RateLimitMiddleware.js";

export const makeRateLimitMiddleware = ({ redisClient, rateLimit, redisStore }) => {
    return new RateLimitMiddleware({ redisClient, rateLimit, redisStore });
};
