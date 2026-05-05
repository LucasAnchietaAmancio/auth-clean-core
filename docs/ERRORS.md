# 🛡️ Padronização de Erros (Error Codes)

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

### 3. Status (Números)
Correspondem ao Status HTTP equivalente (ex: 400, 401, 404, 409, 500).

---

## 📋 Tabela de Códigos Atuais

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
| **PI500** | Presentation Internal Error | Presentation | Erro inesperado capturado pelo middleware global. |

---

## Como utilizar no código

Os erros são lançados através de métodos estáticos nas classes de erro correspondentes, garantindo que o `status` e o `code` estejam sempre corretos.

```javascript
// Exemplo no Use Case
if (userAlreadyExists) {
    throw ApplicationErrors.conflict({
        message: "E-mail já cadastrado",
        description: "Este e-mail já pertence a uma conta ativa."
    });
}
```
