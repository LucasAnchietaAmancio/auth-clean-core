import RedisErrorTranslator from "./RedisErrorTranslator";

export default class RedisClient {
    constructor({ createClientRedis }) {
        this.createClientRedis = createClientRedis;
        this.url = process.env.REDIS_URL;
        this.instance = false;
    };

    async getClient() {
        try {
            if (!this.instance) {
                this.instance = new this.createClientRedis({
                    url: this.url,
                    socket: {
                        reconnectStrategy: (retries) => {
                            if (retries > 20) {
                                throw RedisErrorTranslator.translate({
                                    message: "Número máximo de tentativas de reconexão ao Redis excedido.",
                                    description: "O cliente Redis atingiu o limite de tentativas de reconexão.",
                                    errorClientCode: "MAX_RETRIES_EXCEEDED",
                                    originalError: null
                                });
                            }
                            return Math.min(retries * 100, 3000);
                        }
                    },
                    connectTimeout: 20000,
                });

                this.instance.on("error", (error) => {
                    console.log(error);
                });
            };

            if (!this.instance.isOpen) {
                await this.instance.connect();
            }

            return this.instance;

        } catch (error) {
            if (error instanceof RedisErrorTranslator) {
                throw error;
            };
            return RedisErrorTranslator.translate({
                message: "Falha crítica no cliente Redis",
                description: "Não foi possível inicializar o cliente Redis. Verifique a URL e a disponibilidade do serviço.",
                errorClientCode: "CLIENT_INITIALIZATION_FAILED",
                originalError: error
            });
        }
    }
}