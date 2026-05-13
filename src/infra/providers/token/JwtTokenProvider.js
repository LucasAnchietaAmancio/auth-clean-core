import TokenError from "../../errors/TokenError.js";
import ITokenProvider from "../../../domain/contracts/providers/ITokenProvider.js";

export default class JwtTokenProvider extends ITokenProvider {
    constructor({ jwt, crypto, envs }) {
        super();
        this.jwt = jwt;
        this.secretKey = envs.jwt.secretKey;
        this.crypto = crypto;
    }

    async generateToken({ payload, expires }) {
        try {
            const tokenPayload = {
                ...payload,
                jti: this.crypto.randomUUID(),
            };
            return this.jwt.sign(tokenPayload, this.secretKey, { expiresIn: expires });
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "Não foi possível gerar as credenciais de acesso no momento.",
            });
        };
    };

    async verifyToken({ token }) {
        try {
            return this.jwt.verify(token, this.secretKey);
        } catch (error) {
            throw TokenError.handle({
                error,
                message: "As credenciais fornecidas são inválidas ou expiraram.",
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
