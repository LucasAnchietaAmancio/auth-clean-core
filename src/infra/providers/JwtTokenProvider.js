
import ITokenProvider from "../../application/interfaces/providers/ITokenProvider.js";
import InfrastructureErrors from "../errors/InfrastructureErrors.js";

export default class JwtTokenProvider extends ITokenProvider {
    constructor({ jwt, crypto, envs }) {
        super();
        this.jwt = jwt;
        this.secretKey = envs.jwt.secretKey;
        this.crypto = crypto;
    }

    async generateToken({ payload, expires }) {
        if (!payload) {
            throw InfrastructureErrors.providerError({
                message: "Payload não informado para gerar token",
                description: "Por favor, insira um payload para que o token seja gerado."
            });
        };

        try {
            const tokenPayload = {
                ...payload,
                jti: this.crypto.randomUUID(),
            };
            const token = this.jwt.sign(tokenPayload, this.secretKey, { expiresIn: expires });
            return token;
        } catch (error) {
            throw InfrastructureErrors.providerError({
                message: "Falha interna ao gerar token",
                description: "Ocorreu um erro inesperado no serviço de geração de tokens.",
                details: { provider: "JWT", operation: "generateToken" },
                originalError: error
            });
        };
    };

    async verifyToken({ token }) {
        if (!token) {
            throw InfrastructureErrors.providerError({
                message: "Token não informado para verificação",
                description: "Por favor, insira um token para que a verificação seja realizada."
            });
        };

        try {
            const tokenVerified = this.jwt.verify(token, this.secretKey);
            return tokenVerified;
        } catch (error) {
            throw InfrastructureErrors.providerError({
                message: "Falha interna ao verificar token",
                description: "Ocorreu um erro inesperado no serviço de verificação de tokens.",
                details: { provider: "JWT", operation: "verifyToken" },
                originalError: error
            });
        };
    };

    async decodeToken({ token }) {
        if (!token) {
            throw InfrastructureErrors.providerError({
                message: "Token não informado para decodificar",
                description: "Por favor, insira um token para que a decodificação seja realizada."
            });
        };

        try {
            const tokenDecoded = this.jwt.decode(token);
            return tokenDecoded;
        } catch (error) {
            throw InfrastructureErrors.providerError({
                message: "Falha interna ao decodificar token",
                description: "Ocorreu um erro inesperado no serviço de decodificação de tokens.",
                details: { provider: "JWT", operation: "decodeToken" },
                originalError: error
            });
        };
    };
};