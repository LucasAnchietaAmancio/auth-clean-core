import EnvironmentError from "./errors/EnvironmentError.js";

export default class Envs {
    constructor() {
        this.db = {
            postgres: {
                uri: this.parseTo({ value: process.env.DATABASE_URL, type: "string", key: "DATABASE_URL" }),
                host: this.parseTo({ value: process.env.POSTGRES_HOST, type: "string", key: "POSTGRES_HOST" }),
                port: this.parseTo({ value: process.env.POSTGRES_PORT, type: "number", key: "POSTGRES_PORT" }),
                user: this.parseTo({ value: process.env.POSTGRES_USER, type: "string", key: "POSTGRES_USER" }),
                password: this.parseTo({ value: process.env.POSTGRES_PASSWORD, type: "string", key: "POSTGRES_PASSWORD" }),
                database: this.parseTo({ value: process.env.POSTGRES_DB, type: "string", key: "POSTGRES_DB" })
            },
            redis: {
                url: this.parseTo({ value: process.env.REDIS_URL, type: "string", key: "REDIS_URL" })
            }
        };

        this.hash = {
            salt: this.parseTo({ value: process.env.BCRYPT_SALT, type: "number", key: "BCRYPT_SALT" })
        };

        this.jwt = {
            acessSecretKey: this.parseTo({ value: process.env.JWT_ACCESS_SECRET_KEY, type: "string", key: "JWT_ACCESS_SECRET_KEY" }),
            refreshSecretKey: this.parseTo({ value: process.env.JWT_REFRESH_SECRET_KEY, type: "string", key: "JWT_REFRESH_SECRET_KEY" }),
            accessTokenExpiresIn: this.parseTo({ value: process.env.ACCESS_TOKEN_EXPIRES_IN, type: "string", key: "ACCESS_TOKEN_EXPIRES_IN" }),
            refreshTokenExpiresIn: this.parseTo({ value: process.env.REFRESH_TOKEN_EXPIRES_IN, type: "string", key: "REFRESH_TOKEN_EXPIRES_IN" })
        };

        this.server = {
            port: this.parseTo({ value: process.env.PORT, type: "number", key: "PORT" }),
            nodeEnv: this.parseTo({ value: process.env.NODE_ENV, type: "string", key: "NODE_ENV" })
        };
    };

    parseTo({ value, type, key }) {
        if (value === undefined || value === null || value === "") {
            throw new EnvironmentError({ key, message: `A variável de ambiente obrigatória "${key}" não está definida.` });
        }

        const parsed = type === "number" ? Number(value) : String(value);

        if (type === "number" && isNaN(parsed)) {
            throw new EnvironmentError({ key, message: `A variável de ambiente "${key}" deveria ser numérica, valor recebido: "${value}".` });
        }

        return parsed;
    };
}