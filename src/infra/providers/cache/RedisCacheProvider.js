import ICacheProvider from "../../../domain/contracts/providers/ICacheProvider.js";
import CacheError from "../../errors/CacheError.js";

export default class RedisCacheProvider extends ICacheProvider {
    constructor({ redis }) {
        super();
        this.redis = redis;
    }

    async set({ key, value, expiresIn }) {
        try {
            const cache = await this.redis.getClient();

            if (expiresIn) {
                return await cache.setEx(key, expiresIn, value);
            }

            return await cache.set(key, value);
        } catch (error) {
            throw CacheError.handle({
                error,
                message: "Falha ao tentar inserir valor em cache",
            });
        }
    }

    async get({ key }) {
        try {
            const cache = await this.redis.getClient();
            return await cache.get(key);
        } catch (error) {
            throw CacheError.handle({
                error,
                message: "Falha ao tentar buscar valor em cache",
            });
        }
    }

    async delete({ key }) {
        try {
            const cache = await this.redis.getClient();
            return await cache.del(key);
        } catch (error) {
            throw CacheError.handle({
                error,
                message: "Falha ao tentar remover valor do cache",
            });
        }
    }
}
