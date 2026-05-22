# Clean OAuth Core

API de autenticação desenvolvida com foco em arquitetura escalável, segurança e aplicação de boas práticas de engenharia de software.

O projeto foi criado como laboratório de estudos avançados em backend moderno, explorando conceitos utilizados em aplicações reais, como autenticação baseada em JWT, gerenciamento de sessões com Redis, separação de camadas, DDD (Domain-Driven Design), TDD (Test-Driven Development) e organização arquitetural inspirada em Clean Architecture.

---

# Tecnologias Utilizadas

- Node.js
- JavaScript
- Express
- Prisma ORM
- PostgreSQL
- Redis
- Docker
- Docker Compose
- GitHub Actions
- JWT
- Bcrypt
- Zod

---

# Objetivos do Projeto

Este projeto tem como foco aprofundar conhecimentos em:

- Arquitetura em camadas
- Clean Architecture
- DDD (Domain-Driven Design)
- TDD (Test-Driven Development)
- SOLID
- Separação de responsabilidades
- Fluxo de autenticação moderno
- Gerenciamento de sessão
- Segurança em APIs
- Estruturação backend escalável
- Containerização de aplicações
- CI/CD e automação de pipelines
- Boas práticas de desenvolvimento backend

---

# Funcionalidades

- Registro de usuários
- Login autenticado
- Access Token e Refresh Token
- Cookies HttpOnly
- Rotação de sessão com JTI
- Logout com revogação de sessão
- Endpoint autenticado `/v1/user/me`
- Rate Limit com Redis
- Validação centralizada com Zod
- Estrutura desacoplada em camadas
- Healthcheck entre containers
- AppError para leitura semântica de erros
- Pipeline de CI utilizando GitHub Actions

---

# Arquitetura

O projeto está organizado em camadas inspiradas nos princípios da Clean Architecture e DDD:

```txt
src/
 ├── domain/
 ├── application/
 ├── infra/
 ├── presentation/
 └── main/
```

## Responsabilidades

| Camada | Responsabilidade |
|---|---|
| domain | Regras de negócio |
| application | Casos de uso |
| infra | Banco de dados, Redis e providers |
| presentation | Controllers, middlewares e rotas |
| main | Bootstrap da aplicação |

---

# Fluxo de Autenticação

O sistema utiliza:

- Access Token para autenticação de curta duração
- Refresh Token para renovação de sessão
- Identificador JTI para controle de sessão
- Redis para gerenciamento e revogação
- Cookies HttpOnly para maior segurança

---

# Variáveis de Ambiente

Utilize o `.env.example` como base:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=oauth_db
POSTGRES_PORT=5432

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_PORT}/${POSTGRES_DB}"

BCRYPT_SALT=12

JWT_ACCESS_SECRET_KEY=your_access_secret
JWT_REFRESH_SECRET_KEY=your_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

ACCESS_TOKEN_COOKIE_MAX_AGE_MS=1200000
REFRESH_TOKEN_COOKIE_MAX_AGE_MS=864000000

PORT=8080

REDIS_URL=redis://redis:6379
REDIS_PORT=6379
```

---

# Executando com Docker

Clone o projeto:

```bash
git clone https://github.com/LucasAnchietaAmancio/auth-clean-core.git
```

Acesse a pasta:

```bash
cd auth-clean-core
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Suba os containers:

```bash
docker compose up --build
```

---

# Scripts Disponíveis

```bash
npm run dev
npm start
npm test
npm run lint
```

---

# Banco de Dados

As migrations estão localizadas em:

```txt
prisma/migrations
```

Para aplicar as migrations:

```bash
npx prisma migrate deploy
```

---

# Endpoints

## Auth

| Método | Rota | Descrição |
|---|---|---|
| POST | `/v1/login` | Login |
| POST | `/v1/refresh` | Renovação de token |
| POST | `/v1/logout` | Logout |

---

## Usuário

| Método | Rota | Descrição |
|---|---|---|
| POST | `/v1/user/register` | Registro de usuário |
| GET | `/v1/user/me` | Retorna o usuário autenticado |

---

# Estrutura Técnica

O projeto aplica conceitos como:

- Repository Pattern
- Use Cases
- Dependency Separation
- Middleware de autenticação
- Centralização de validações
- Persistência de sessão com Redis
- JWT + Refresh Token Flow
- Organização desacoplada de regras de negócio
- Arquitetura orientada a responsabilidades
- Root Composition
- Factory Pattern
- Testes automatizados
- DDD (Domain-Driven Design)
- TDD (Test-Driven Development)
- Pipeline de CI com GitHub Actions

---

# Roadmap

Funcionalidades futuras planejadas:

- [ ] Rotação avançada de refresh token
- [ ] RBAC (Role Based Access Control)
- [ ] Autenticação em dois fatores (2FA)
- [ ] Testes de integração
- [ ] Documentação com Swagger
- [ ] Observabilidade e logs
- [ ] CI/CD mais avançado
- [ ] Monitoramento
- [ ] Hardening de segurança
- [ ] Rate limit avançado

---

# Status

🚧 Projeto em desenvolvimento contínuo.

Este projeto está sendo utilizado como ambiente de estudo e evolução técnica em backend, arquitetura de software, DDD, TDD, CI/CD e autenticação moderna.