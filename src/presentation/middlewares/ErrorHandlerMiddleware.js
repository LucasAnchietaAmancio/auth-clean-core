import AppError from "../../shared/errors/AppError.js";

export default class ErrorHandlerMiddleware {
    static execute(err, req, res, next) {

        const typeToStatus = {
            "VALIDATION": 400,
            "INPUT": 400,
            "UNAUTHORIZED": 401,
            "UNAUTHENTICATION": 401,
            "FORBIDDEN": 403,
            "NOT_FOUND": 404,
            "CONFLICT": 409,
            "RATE_LIMITED": 429,
            "INTERNAL": 500,
            "UNAVAILABLE": 503
        };

        if (err instanceof AppError) {
            const statusCode = typeToStatus[err.type] || 500;
            console.error(`\n[SERVICE ERROR] ${req.method} ${req.originalUrl}`);
            console.error(`|-- Type: ${err.type}`);
            console.error(`|-- Code: ${err.code}`);
            console.error(`|-- Message: ${err.message}`);
            console.error(`|-- Description: ${err.metadata?.description}`);
            console.error(`|-- Cause: ${err.metadata?.cause}`);
            console.error(`|-- Stack: ${err.stack}`);
            console.error("---------------------------\n");

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: err.code,
                    message: err.message,
                    category: err.category,
                    type: err.type,
                    timestamp: err.timestamp || new Date().toISOString(),
                    metadata: {
                        description: err.metadata?.description || null,
                        cause: err.metadata?.cause || null
                    }
                }
            });
        }

        console.error(`\n[UNHANDLED ERROR] ${req.method} ${req.originalUrl}`);
        console.error(err);

        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Ocorreu um erro inesperado no servidor",
                description: "Não foi possível processar sua solicitação no momento.",
                timestamp: new Date().toISOString(),
            }
        });
    }
}