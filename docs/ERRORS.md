# Padronização de Erros (Error Codes)

Este projeto utiliza uma nomenclatura semântica para códigos de erro, facilitando a identificação da origem e do tipo de falha.

## Estrutura do Código: `[ORIGEM][TIPO][STATUS]`

### 1. Origem (Primeira Letra)
- **D**: Domain (Camada de Domínio)
- **A**: Application (Camada de Aplicação)
- **I**: Infrastructure (Camada de Infraestrutura)
- **P**: Presentation (Camada de Apresentação)

### 2. Tipo (Segunda Letra)
- **F**: Field Validation (Erro de validação de campo)
- **C**: Business Conflict (Conflito de regra de negócio)
- **U**: Unauthorized (Erro de autenticação)

### 3. Status (Números)
Correspondem ao Status HTTP equivalente (ex: 400, 401, 409, 500).

---

## Tabela de Códigos Atuais

| Código | Descrição | Camada |
| :--- | :--- | :--- |
| **DF400** | Domain Field Validation | Domain |
| **AC409** | Application Business Conflict | Application |
