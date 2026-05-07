import IHashProvider from "../../application/interfaces/providers/IHashProvider.js";
import InfrastructureErrors from "../errors/InfrastructureErrors.js";

export default class BcryptHashProvider extends IHashProvider {
    constructor({ bcrypt, envs }) {
        super();
        this.bcrypt = bcrypt;
        this.salt = envs.hash.salt;
    }

    async hash({ value }) {
        if (!value) {
            throw InfrastructureErrors.providerError({
                message: "Valor não informado para gerar hash",
                description: "Por favor, insira um valor para que o hash seja gerado."
            });
        }

        try {
            const valueHashed = await this.bcrypt.hash(value, this.salt);

            if (!valueHashed || valueHashed.length === 0) {
                throw InfrastructureErrors.providerError({
                    message: "Falha ao gerar hash",
                    description: "Ocorreu um erro ao gerar o hash do valor informado: retorno vazio."
                });
            }

            return valueHashed;
        } catch (error) {
            throw InfrastructureErrors.providerError({
                message: "Falha interna ao gerar hash",
                description: "Ocorreu um erro inesperado no serviço de criptografia.",
                details: { provider: "Bcrypt", operation: "hash" },
                originalError: error
            });
        }
    }

    async compare({ value, hash }) {
        if (!value || !hash) {
            throw InfrastructureErrors.providerError({
                message: "Valor ou hash não informado para comparação",
                description: "Por favor, insira um valor e um hash para que a comparação seja realizada."
            });
        }

        try {
            const valueCompared = await this.bcrypt.compare(value, hash);
            return valueCompared;

        } catch (error) {
            throw InfrastructureErrors.providerError({
                message: "Falha interna ao comparar hash",
                description: "Ocorreu um erro inesperado no serviço de comparação.",
                details: { provider: "Bcrypt", operation: "compare" },
                originalError: error
            });
        }
    }
}