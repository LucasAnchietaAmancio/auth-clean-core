import RedisErrorTranslator from "./RedisErrorTranslator.js";

export default class RedisClient {
    constructor({ createClientRedis }) {
        this.createClientRedis = createClientRedis;
        this.url = process.env.REDIS_URL;
        this.client = null;
    };

    async getClient() {
        if (this.client && this.client.isOpen) {
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

            throw RedisErrorTranslator.translate({
                error,
                message: "Falha ao conectar ao Redis.",
                description: "Não foi possível estabelecer conexão com o servidor Redis."
            });
        }
    }
}