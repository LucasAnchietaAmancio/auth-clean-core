# Padronização de Erros (Error Handling)

Este projeto utiliza uma arquitetura unificada de tratamento de erros através de uma classe base `AppError`. O objetivo é fornecer erros semânticos, estruturados e com uma taxonomia clara para facilitar a depuração e o feedback para o cliente.

## Estrutura do Erro: `AppError`

Todas as exceções do sistema herdam de `AppError` e devem fornecer os seguintes atributos principais:

- **`code`**: String descritiva em UPPER_SNAKE_CASE (ex: `INVALID_PASSWORD`, `EMAIL_ALREADY_IN_USE`).
- **`category`**: A camada arquitetural onde o erro foi originado (`DOMAIN`, `APPLICATION`, `INFRASTRUCTURE`, `PRESENTATION`).
- **`severity`**: Nível de criticidade do erro (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **`message`**: Mensagem curta e amigável sobre o erro.
- **`metadata`**: (Opcional) Objeto com dados adicionais:
  - `description`: Explicação detalhada.
  - `cause`: A causa raiz original, capturada em blocos try/catch ou proveniente de bibliotecas terceiras.

---

## Formato de Resposta Padronizado (JSON)

O `ErrorHandlerMiddleware` intercepta o `AppError` e o padroniza em uma resposta JSON. A formatação segue o padrão:

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_IN_USE",
    "message": "E-mail já cadastrado",
    "timestamp": "2026-05-13T12:00:00.000Z",
    "metadata": {
      "description": "O e-mail informado já está em uso por outra conta.",
      "cause": null
    }
  }
}
```

> **Nota:** Em caso de erros não mapeados (exceções nativas), o middleware retorna um erro genérico `INTERNAL_SERVER_ERROR` sem vazar o stack trace para o cliente.

---

## Mapeamento de Códigos Atuais

O `ErrorHandlerMiddleware` contém um mapeamento interno (`codeHandler`) que traduz o `code` de cada exceção para um `HTTP Status Code` adequado.

| Código (`code`) | Categoria (`category`) | Status HTTP | Motivo Comum |
| :--- | :--- | :--- | :--- |
| **`INVALID_EMAIL`** | `DOMAIN` | 400 | Formato de e-mail inválido. |
| **`INVALID_PASSWORD`** | `DOMAIN` | 400 | Senha não atende aos critérios de segurança. |
| **`INVALID_NAME`** | `DOMAIN` | 400 | Nome de usuário fora dos limites estipulados. |
| **`INVALID_CREDENTIALS`** | `APPLICATION` | 401 | E-mail e/ou senha incorretos durante o login. |
| **`TOKEN_ERROR`** | `INFRASTRUCTURE` | 401 | Token JWT inválido, expirado ou malformado. |
| **`UNAUTHORIZED`** | `PRESENTATION` | 401 | Acesso restrito a um recurso sem autenticação válida. |
| **`EMAIL_ALREADY_IN_USE`** | `APPLICATION` | 409 | Tentativa de cadastro com e-mail já existente no banco. |
| **`RESOURCE_CONFLICT`** | `APPLICATION` | 409 | Violação genérica de unicidade (conflito de negócio). |
| **`ROUTE_NOT_FOUND`** | `PRESENTATION` | 404 | Tentativa de acesso a um endpoint inexistente. |
| **`TOO_MANY_REQUESTS`** | `PRESENTATION` | 429 | Limite do Rate Limit do Redis excedido. |
| **`DATABASE_ERROR`** | `INFRASTRUCTURE` | 500 | Erro em queries, conexão ou mapeamento via Prisma. |
| **`EXTERNAL_SERVICE_ERROR`**| `INFRASTRUCTURE`| 502 | Falha ao contactar serviços de terceiros. |
| **`CONNECTION_REFUSED`** | `INFRASTRUCTURE` | 503 | Banco de dados ou cache (Redis) indisponíveis. |

---

## Logging no Servidor

Para fins de observabilidade, o Middleware gera um log detalhado no console *apenas para o servidor*, permitindo investigar a origem da falha:

```text
[SERVICE ERROR] POST /api/v1/auth/login
|-- Code: INVALID_CREDENTIALS
|-- Message: Credenciais inválidas
|-- Description: O usuário não foi encontrado ou a senha está incorreta.
|-- Cause: null
|-- Stack: AppError: Credenciais inválidas at LoginUseCase.execute ...
---------------------------
```
