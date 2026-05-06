# Clean OAuth Core

Uma API de autenticação robusta e escalável construída com **Node.js**, seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. 

Este projeto foi desenvolvido com foco em alta testabilidade, integridade de domínio e segurança avançada.

---

## Funcionalidades Atuais

- [x] **Domínio Rico**: Entidades e Objetos de Valor (`Email`, `Password`, `Name`) com autovalidação e lógica de negócio encapsulada.
- [x] **Gestão de Erros Semântica**: Sistema centralizado com códigos únicos, timestamps e rastreabilidade total. Veja [ERRORS.md](docs/ERRORS.md).
- [x] **Autenticação Local**: Registro e Login de usuários com criptografia Bcrypt.
- [x] **Sessões Seguras (JWT)**: Geração de tokens com `jti` (JWT ID) para rastreabilidade e expiração controlada.
- [x] **Segurança Avançada**: 
    - **Rate Limiting (Redis)**: Proteção distribuída contra força bruta com suporte a múltiplos prefixos.
    - **Payload Limit**: Proteção contra ataques de DoS via JSON massivo.
    - **User Enumeration Prevention**: Respostas unificadas para e-mail/senha incorretos.
- [x] **Arquitetura de Middlewares**: Todos os middlewares (`RateLimit`, `Validation`, `ErrorHandler`) implementados como Classes para maior consistência e desacoplamento.
- [x] **Validação Centralizada**: Middlewares de validação usando **Zod** desacoplados dos Controllers.
- [x] **Infraestrutura Robusta**: Tradutores automáticos de erros (`Prisma` e `Redis`) para garantir respostas seguras.

---

## Tecnologias e Ferramentas

- **Backend**: Node.js (ESModules)
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL (Prisma ORM)
- **Cache & Throttling**: Redis
- **Validação**: Zod
- **Segurança**: Bcrypt (Hashing) / JWT (Tokens)

---

## Arquitetura

O projeto segue a **Clean Architecture**, dividida em:

1. **Domain**: Regras de negócio puras (Entities, Value Objects).
2. **Application**: Casos de uso (Use Cases), DTOs e Portas (Interfaces).
3. **Infrastructure**: Implementações técnicas (Prisma, Repositórios, Providers de Hash/Token).
4. **Presentation**: Camada externa (Controllers, Routes, Middlewares de Protocolo).
5. **Main (Factories)**: Ponto de composição do sistema onde as dependências são injetadas (Composition Root).

---

## Como Rodar o Projeto

### Pré-requisitos
- Node.js v18+
- Docker (para PostgreSQL e Redis)

### Instalação
1. Clone o repositório.
2. Instale as dependências: `npm install`
3. Configure o arquivo `.env` (use o `.env.example` como base).
4. Suba os serviços: `docker-compose up -d`
5. Prepare o banco: `npx prisma db push`
6. Rode em desenvolvimento: `npm run dev`

---

*Desenvolvido com ☕ e foco em Clean Code.*
