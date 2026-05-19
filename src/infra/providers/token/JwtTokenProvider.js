import TokenError from "../../errors/TokenError.js";
import ITokenProvider from "../../../domain/contracts/providers/ITokenProvider.js";

export default class JwtTokenProvider extends ITokenProvider {
    constructor({ jwt, crypto, envs }) {
        super();
        this.jwt = jwt;
        this.secretKey = envs.jwt;
        this.crypto = crypto;
    }

    async generateAccessToken({ payload, expires }) {
        try {
            const tokenPayload = {
                ...payload,
                jti: this.crypto.randomUUID(),
            };
            return this.jwt.sign(tokenPayload, this.secretKey.acessSecretKey, { expiresIn: expires });
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "Não foi possível gerar as credenciais de acesso no momento.",
            });
        };
    };

    async generateRefreshToken({ payload, expires }) {
        try {
            const tokenPayload = {
                ...payload,
                jti: this.crypto.randomUUID(),
            };
            return this.jwt.sign(tokenPayload, this.secretKey.refreshSecretKey, { expiresIn: expires });
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "Não foi possível gerar as credenciais de atualização no momento.",
            });
        };
    };

    async verifyAccessToken({ accessToken }) {
        try {
            return this.jwt.verify(accessToken, this.secretKey.acessSecretKey);
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "As credenciais de acesso fornecidas são inválidas ou expiraram.",
            });
        };
    };

    async verifyRefreshToken({ refreshToken }) {
        try {
            return this.jwt.verify(refreshToken, this.secretKey.refreshSecretKey);
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "As credenciais de atualização fornecidas são inválidas ou expiraram.",
            });
        };
    };

    async decodeToken({ token }) {
        try {
            return this.jwt.decode(token);
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "Não foi possível ler as informações do token fornecido.",
            });
        };
    };
};
