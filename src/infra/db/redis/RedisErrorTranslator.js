import InfrastructureErrors from "../../errors/InfrastructureErrors.js";

export default class RedisErrorTranslator {
    static translate({ error, message, description }) {
        return InfrastructureErrors.connectionExternalServiceError({
            message: message || "Houve uma falha ao se conectar ao Redis.",
            description: description || "Houve uma falha ao processar a operação no Redis.",
            originalError: error
        });
    }
}
