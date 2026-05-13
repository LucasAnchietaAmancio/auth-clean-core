import ConnectionRefused from "../../../infra/errors/ConnectionRefused.js";

export default class PrismaClient {
    constructor({ prismaClient, envs }) {
        this.prismaClient = prismaClient;
        this.url = envs.db.postgres.uri;
        this.client = null;
    }

    async getClient() {
        if (this.client) {
            return this.client;
        }

        try {
            this.client = new this.prismaClient({
                datasources: {
                    db: {
                        url: this.url,
                    },
                },
            });

            await this.client.$connect();

            return this.client;

        } catch (error) {
            this.client = null;
            throw new ConnectionRefused({
                originalError: error
            });
        }
    }
}