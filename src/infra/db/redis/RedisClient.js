import ConnectionRefused from "../../../infra/errors/ConnectionRefused.js";

export default class RedisClient {
    constructor({ createClientRedis, envs }) {
        this.createClientRedis = createClientRedis;
        this.url = envs.db.redis.url;
        this.client = null;
    };

    async getClient() {
        if (this.client) {
            return this.client;
        }

        try {
            this.client = this.createClientRedis({
                url: this.url,
                socket: {
                    reconnectStrategy: false
                }
            });

            this.client.on("error", (error) => {
                console.error("[REDIS ERROR]:", error.message);
            });

            await this.client.connect();

            return this.client;

        } catch (error) {
            this.client = null;
            throw new ConnectionRefused({
                originalError: error
            });
        }
    }
}