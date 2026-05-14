export default class Envs {
    constructor() {
        this.db = {
            postgres: {
                uri: this.parseTo({ value: process.env.DATABASE_URI, type: "string" }),
                host: this.parseTo({ value: process.env.POSTGRES_HOST, type: "string" }),
                port: this.parseTo({ value: process.env.POSTGRES_PORT, type: "number" }),
                user: this.parseTo({ value: process.env.POSTGRES_USER, type: "string" }),
                password: this.parseTo({ value: process.env.POSTGRES_PASSWORD, type: "string" }),
                database: this.parseTo({ value: process.env.POSTGRES_DB, type: "string" })
            },
            redis: {
                url: this.parseTo({ value: process.env.REDIS_URL, type: "string" })
            }
        };

        this.hash = {
            salt: this.parseTo({ value: process.env.BCRYPT_SALT, type: "number" })
        };

        this.jwt = {
            secretKey: this.parseTo({ value: process.env.JWT_SECRET_KEY, type: "string" }),
            accessTokenExpiresIn: this.parseTo({ value: process.env.ACCESS_TOKEN_EXPIRES_IN, type: "string" }),
            refreshTokenExpiresIn: this.parseTo({ value: process.env.REFRESH_TOKEN_EXPIRES_IN, type: "string" })
        };

        this.server = {
            port: this.parseTo({ value: process.env.PORT, type: "number" }),
            nodeEnv: this.parseTo({ value: process.env.NODE_ENV, type: "string" })
        };
    };

    parseTo({ value, type }) {

        const types = {
            number: () => Number(value),
            string: () => String(value)
        };

        return types[type]();

    };
};