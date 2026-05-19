import TooManyRequestsError from "../../errors/TooManyRequestsError.js";

export default class RateLimitMiddleware {
    constructor({ redisClient, rateLimit, redisStore }) {
        this.redisClient = redisClient;
        this.rateLimit = rateLimit;
        this.redisStore = redisStore;
        this.limiter = null;
    };

    execute({ limit, minutes, prefix }) {
        return async (req, res, next) => {
            try {
                if (!this.limiter) {
                    const client = await this.redisClient.getClient();

                    this.limiter = this.rateLimit({
                        windowMs: minutes * 60 * 1000,
                        limit: limit,
                        standardHeaders: "draft-7",
                        legacyHeaders: false,
                        store: new this.redisStore({
                            sendCommand: (...args) => client.sendCommand(args),
                            prefix: `rl:${prefix}:`,
                        }),
                        handler: (req, res, next) => {
                            next(new TooManyRequestsError({ originalError: `Limite de requisições excedido. Tente novamente em ${minutes} minutos.` }));
                        },
                    });
                }

                return this.limiter(req, res, next);

            } catch (error) {
                console.error("[RATE LIMIT]: Redis indisponível, requisição liberada.", error.message);
                return next();
            }
        };
    }
}
