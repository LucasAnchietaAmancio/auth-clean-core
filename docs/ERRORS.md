# Padronização de Erros (Error Codes)

Este projeto utiliza uma nomenclatura semântica para códigos de erro, facilitando a identificação da origem e do tipo de falha em toda a arquitetura.

## Estrutura do Código: `[ORIGEM][TIPO][STATUS]`

### 1. Origem (Primeira Letra)
- **D**: Domain (Camada de Domínio)
- **A**: Application (Camada de Aplicação)
- **I**: Infrastructure (Camada de Infraestrutura)
- **P**: Presentation (Camada de Apresentação)

### 2. Tipo (Segunda Letra)
- **F**: Field Validation (Erro de validação de campo)
- **C**: Business Conflict (Conflito de regra de negócio)
- **U**: Unauthorized (Erro de autenticação/permissão)
- **N**: Not Found (Recurso não encontrado)
- **B**: Bad Request (Requisição malformada)
- **I**: Internal Error (Erro interno ou de servidor)
- **R**: Rate Limit (Throttling)

### 3. Status (Números)
Correspondem ao Status HTTP equivalente (ex: 400, 401, 404, 409, 429, 500).

---

## Formato de Resposta Padronizado (JSON)

Todas as classes de erro herdam de `Error` e fornecem uma estrutura consistente que o `ErrorHandlerMiddleware` utiliza para responder ao cliente:

```json
{
  "success": false,
  "error": {
    "code": "PF400",
    "message": "Mensagem curta amigável",
    "description": "Explicação detalhada do erro para o usuário final",
    "timestamp": "2026-05-06T18:00:00.000Z",
    "details": {}, // Opcional (apenas em desenvolvimento ou erros de validação)
    "cause": "..." // Opcional (apenas em desenvolvimento)
  }
}
```

---

## Tabela de Códigos Atuais

| Código | Descrição | Camada | Motivo Comum |
| :--- | :--- | :--- | :--- |
| **DF400** | Domain Field Validation | Domain | Dados inválidos nos Value Objects (Email, Nome, Senha). |
| **AB400** | Application Bad Request | Application | DTOs de entrada incompletos ou inválidos. |
| **AN404** | Application Not Found | Application | Recurso solicitado não existe no banco de dados. |
| **AU401** | Application Unauthorized | Application | Credenciais de login incorretas ou token inválido. |
| **AC409** | Application Business Conflict | Application | E-mail já cadastrado ou violação de regra de negócio única. |
| **AI500** | Application Internal Error | Application | Falha inesperada no processamento da regra de negócio. |
| **ID500** | Infrastructure DB Error | Infrastructure | Erro de conexão ou falha na query do banco de dados. |
| **PF400** | Presentation Field Validation | Presentation | Dados de entrada inválidos via Zod no Controller. |
| **PN404** | Presentation Not Found | Presentation | Endpoint ou rota não encontrada. |
| **PI429** | Presentation Rate Limit | Presentation | Limite de requisições excedido para o IP ou rota. |
| **PI500** | Presentation Internal Error | Presentation | Erro inesperado capturado pelo middleware global. |

---

## Tradução e Gestão de Erros

O projeto utiliza **Translators** para garantir que erros de terceiros não vazem detalhes de implementação:

- **`PrismaErrorTranslator`**: Converte erros de banco (ex: `P2002`) em erros semânticos como `AC409`.
- **`RedisErrorTranslator`**: Converte falhas de conexão com o cache em erros de infraestrutura `ID500`.
- **Explicit HTTP Status**: Todas as classes de erro agora possuem a propriedade `httpStatus` embutida, permitindo que o middleware de resposta seja totalmente agnóstico e seguro.
