const openApiSpecification = {
    openapi: "3.0.3",
    info: {
        title: "OAuth Authentication API",
        version: "1.0.0",
        description: "API academica para autenticacao com JWT, Redis, PostgreSQL, Clean Architecture, DDD, SOLID e TDD."
    },
    externalDocs: {
        description: "Swagger UI",
        url: "/docs"
    },
    servers: [
        {
            url: "/v1",
            description: "Base versionada da API"
        }
    ],
    tags: [
        {
            name: "Auth",
            description: "Operacoes de autenticacao, refresh e logout"
        },
        {
            name: "User",
            description: "Operacoes de cadastro e consulta de usuario"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            },
            refreshTokenCookie: {
                type: "apiKey",
                in: "cookie",
                name: "refreshToken"
            }
        },
        schemas: {
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                additionalProperties: false,
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        maxLength: 55,
                        example: "lucas@email.com"
                    },
                    password: {
                        type: "string",
                        maxLength: 55,
                        example: "secret123"
                    }
                }
            },
            CreateUserRequest: {
                type: "object",
                required: ["name", "email", "password"],
                additionalProperties: false,
                properties: {
                    name: {
                        type: "string",
                        maxLength: 55,
                        example: "Lucas Silva"
                    },
                    email: {
                        type: "string",
                        format: "email",
                        maxLength: 55,
                        example: "lucas@email.com"
                    },
                    password: {
                        type: "string",
                        maxLength: 55,
                        example: "secret123"
                    }
                }
            },
            SessionMetadata: {
                type: "object",
                required: ["idUser", "accessToken"],
                additionalProperties: false,
                properties: {
                    idUser: {
                        type: "integer",
                        example: 1
                    },
                    accessToken: {
                        type: "string",
                        description: "JWT de acesso usado no header Authorization",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                }
            },
            AuthSessionResponse: {
                type: "object",
                required: ["success", "message", "metadata"],
                additionalProperties: false,
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    message: {
                        type: "string",
                        example: "Login realizado com sucesso"
                    },
                    metadata: {
                        $ref: "#/components/schemas/SessionMetadata"
                    }
                }
            },
            LogoutResponse: {
                type: "object",
                required: ["success", "message"],
                additionalProperties: false,
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    message: {
                        type: "string",
                        example: "Logoff realizado com sucesso"
                    }
                }
            },
            UserResponse: {
                type: "object",
                required: ["idUser", "name", "email"],
                additionalProperties: false,
                properties: {
                    idUser: {
                        type: "integer",
                        example: 1
                    },
                    name: {
                        type: "string",
                        example: "Lucas Silva"
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "lucas@email.com"
                    }
                }
            },
            CreateUserResponse: {
                type: "object",
                required: ["success", "data"],
                additionalProperties: false,
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    data: {
                        $ref: "#/components/schemas/UserResponse"
                    }
                }
            },
            GetProfileResponse: {
                type: "object",
                required: ["success", "data"],
                additionalProperties: false,
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    data: {
                        $ref: "#/components/schemas/UserResponse"
                    }
                }
            },
            ErrorDetails: {
                type: "object",
                required: ["description", "cause"],
                additionalProperties: false,
                properties: {
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Token de acesso e invalido para essa requisicao."
                    },
                    cause: {
                        type: "string",
                        nullable: true,
                        example: "Token de acesso nao fornecido ou formato invalido."
                    }
                }
            },
            AppErrorResponse: {
                type: "object",
                required: ["success", "error"],
                additionalProperties: false,
                properties: {
                    success: {
                        type: "boolean",
                        example: false
                    },
                    error: {
                        type: "object",
                        required: ["code", "message", "category", "type", "timestamp", "metadata"],
                        additionalProperties: false,
                        properties: {
                            code: {
                                type: "string",
                                example: "UNAUTHORIZED_USER"
                            },
                            message: {
                                type: "string",
                                example: "Usuario nao autenticado"
                            },
                            category: {
                                type: "string",
                                example: "PRESENTATION"
                            },
                            type: {
                                type: "string",
                                example: "UNAUTHORIZED"
                            },
                            timestamp: {
                                type: "string",
                                format: "date-time"
                            },
                            metadata: {
                                $ref: "#/components/schemas/ErrorDetails"
                            }
                        }
                    }
                }
            },
            UnhandledErrorResponse: {
                type: "object",
                required: ["success", "error"],
                additionalProperties: false,
                properties: {
                    success: {
                        type: "boolean",
                        example: false
                    },
                    error: {
                        type: "object",
                        required: ["code", "message", "description", "timestamp"],
                        additionalProperties: false,
                        properties: {
                            code: {
                                type: "string",
                                example: "INTERNAL_SERVER_ERROR"
                            },
                            message: {
                                type: "string",
                                example: "Ocorreu um erro inesperado no servidor"
                            },
                            description: {
                                type: "string",
                                example: "Nao foi possivel processar sua solicitacao no momento."
                            },
                            timestamp: {
                                type: "string",
                                format: "date-time"
                            }
                        }
                    }
                }
            },
            ErrorResponse: {
                oneOf: [
                    {
                        $ref: "#/components/schemas/AppErrorResponse"
                    },
                    {
                        $ref: "#/components/schemas/UnhandledErrorResponse"
                    }
                ]
            }
        }
    },
    paths: {
        "/login": {
            post: {
                tags: ["Auth"],
                summary: "Authenticate user and issue session tokens",
                description: "Returns the access token in the response body and persists the refresh token as an HttpOnly cookie.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest"
                            },
                            example: {
                                email: "lucas@email.com",
                                password: "secret123"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Authenticated successfully",
                        headers: {
                            "Set-Cookie": {
                                description: "HttpOnly refresh token cookie",
                                schema: {
                                    type: "string"
                                }
                            }
                        },
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthSessionResponse"
                                },
                                example: {
                                    success: true,
                                    message: "Login realizado com sucesso",
                                    metadata: {
                                        idUser: 1,
                                        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: "Invalid input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    401: {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Rotate session using the refresh token cookie",
                description: "Validates the refresh token stored in the HttpOnly cookie, issues new tokens and rotates the session.",
                security: [
                    {
                        refreshTokenCookie: []
                    }
                ],
                responses: {
                    200: {
                        description: "Session rotated successfully",
                        headers: {
                            "Set-Cookie": {
                                description: "New HttpOnly refresh token cookie",
                                schema: {
                                    type: "string"
                                }
                            }
                        },
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthSessionResponse"
                                },
                                example: {
                                    success: true,
                                    message: "Sessao rotacionada com sucesso",
                                    metadata: {
                                        idUser: 1,
                                        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: "Invalid or missing refresh token",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/logout": {
            post: {
                tags: ["Auth"],
                summary: "Invalidate the session and blacklist the access token",
                description: "Receives the refresh token from the cookie to revoke the stored session and the access token from Authorization to blacklist its jti as auth:blacklist:<jti>.",
                security: [
                    {
                        bearerAuth: [],
                        refreshTokenCookie: []
                    }
                ],
                responses: {
                    200: {
                        description: "Logged out successfully",
                        headers: {
                            "Set-Cookie": {
                                description: "Clears the refresh token cookie",
                                schema: {
                                    type: "string"
                                }
                            }
                        },
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/LogoutResponse"
                                },
                                example: {
                                    success: true,
                                    message: "Logoff realizado com sucesso"
                                }
                            }
                        }
                    },
                    400: {
                        description: "Invalid or missing token",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/user/register": {
            post: {
                tags: ["User"],
                summary: "Create a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateUserRequest"
                            },
                            example: {
                                name: "Lucas Silva",
                                email: "lucas@email.com",
                                password: "secret123"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "User created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/CreateUserResponse"
                                },
                                example: {
                                    success: true,
                                    data: {
                                        idUser: 1,
                                        name: "Lucas Silva",
                                        email: "lucas@email.com"
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: "Invalid input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    409: {
                        description: "Conflict",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/user/me": {
            get: {
                tags: ["User"],
                summary: "Get the authenticated user profile",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Profile found successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/GetProfileResponse"
                                },
                                example: {
                                    success: true,
                                    data: {
                                        idUser: 1,
                                        name: "Lucas Silva",
                                        email: "lucas@email.com"
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    404: {
                        description: "User not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default openApiSpecification;
