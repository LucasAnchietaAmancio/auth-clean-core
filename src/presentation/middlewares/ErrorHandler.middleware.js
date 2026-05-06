import { z } from "zod";

export default function ErrorHandler(err, req, res, next) {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (err instanceof z.ZodError) {
        return res.status(400).json({
            success: false,
            error: {
                code: "PF400",
                message: "Dados de entrada inválidos",
                description: "Um ou mais campos enviados não atendem aos requisitos de validação.",
                details: err.issues.map(error => ({
                    field: error.path.join("."),
                    message: error.message
                })),
                timestamp: new Date().toISOString()
            }
        });
    }

    if (!err.code || err.code.endsWith("500")) {
        console.error("\n[INTERNAL ERROR DETECTED]");
        console.error(`|-- Message: ${err.message}`);
        console.error(`|-- Code: ${err.code || "UNKNOWN"}`);
        console.error(`|-- Route: ${req.method} ${req.originalUrl}`);
        if (err.cause || err.stack) {
            console.error(`|-- Cause/Stack: ${err.cause?.stack || err.stack}`);
        }
        console.error("---------------------------\n");
    }

    if (err.code) {
        const statusCode = parseInt(err.code.slice(-3)) || 500;
        return res.status(statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                description: err.description || null,
                timestamp: new Date().toISOString(),
                ...(isDevelopment && {
                    details: err.details || null,
                    cause: err.cause?.message || err.message,
                    stack: err.stack
                })
            }
        });
    }

    return res.status(500).json({
        success: false,
        error: {
            code: "PI500",
            message: "Ocorreu um erro interno no servidor",
            description: "Não foi possível processar sua solicitação no momento. Tente novamente mais tarde.",
            timestamp: new Date().toISOString(),
            ...(isDevelopment && { stack: err.stack })
        }
    });
}
