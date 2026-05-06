import ApplicationErrors from "../../../application/errors/ApplicationErrors.js";
import InfrastructureErrors from "../../errors/InfrastructureErrors.js";

export default class PrismaErrorTranslator {
    static translate({ error, message, description }) {
        if (error.code === "P2002") {
            return ApplicationErrors.conflict({
                message: message || "Conflito de dados",
                description: description || "Um registro com estes dados já existe."
            });
        }

        if (error.code === "P2025") {
            return ApplicationErrors.notFound({
                message: message || "Registro não encontrado",
                description: description || "O recurso solicitado não existe ou já foi removido."
            });
        }

        return InfrastructureErrors.databaseError({
            message: message || "Erro de persistência",
            description: description || "Houve uma falha ao processar a operação no banco de dados.",
            errorClientCode: error.code,
            originalError: error
        });
    }
}
