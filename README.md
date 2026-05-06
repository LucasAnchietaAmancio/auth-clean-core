# Clean OAuth Core

Uma API de autenticação robusta e escalável construída com **Node.js**, seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. 

Este projeto foi desenvolvido com foco em alta testabilidade, integridade de domínio e segurança avançada.

---

## Funcionalidades Atuais

- [x] **Domínio Rico**: Entidades e Objetos de Valor (`Email`, `Password`, `Name`) com autovalidação.
- [x] **Gestão de Erros Semântica**: Sistema centralizado de códigos de erro (`PF400`, `AC409`, `ID500`). Veja [ERRORS.md](docs/ERRORS.md).
- [x] **Autenticação Local**: Registro e Login de usuários com criptografia Bcrypt.
- [x] **Sessões Seguras (JWT)**: Geração de tokens com `jti` (JWT ID) para rastreabilidade e expiração controlada.
- [x] **Segurança Avançada**: 
    - **Rate Limiting**: Proteção contra ataques de força bruta.
    - **Payload Limit**: Proteção contra ataques de DoS via JSON massivo.
    - **User Enumeration Prevention**: Respostas unificadas para e-mail/senha incorretos.
- [x] **Validação Centralizada**: Middlewares de validação usando **Zod** desacoplados dos Controllers.
- [x] **Infraestrutura Robusta**: Tradutor automático de erros do Prisma (`PrismaErrorTranslator`).

---

## Tecnologias e Ferramentas

- **Backend**: Node.js (ESModules)
- **Framework**: Express.js
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validação**: [Zod](https://zod.dev/)
- **Segurança**: Bcrypt (Hashing) / JWT (Tokens) / express-rate-limit
- **Banco de Dados**: PostgreSQL

---

## Arquitetura

O projeto segue a **Clean Architecture**, dividida em:

1. **Domain**: Regras de negócio puras (Entities, Value Objects).
2. **Application**: Casos de uso (Use Cases) e interfaces.
3. **Infrastructure**: Implementações técnicas (Prisma, Repositórios, Providers de Segurança).
4. **Presentation**: Camada externa (Controllers, Routes, Middlewares, Schemas).

---

## Como Rodar o Projeto

### Instalação
1. Clone o repositório.
2. Instale as dependências: `npm install`
3. Configure o arquivo `.env` (use o `.env.example` como base).
4. Prepare o banco: `npx prisma db push`
5. Rode em desenvolvimento: `npm run dev`

---

*Desenvolvido com ☕ e foco em Clean Code.*
