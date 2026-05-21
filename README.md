# Clean OAuth Core

API de autenticacao com Node.js, Express, Prisma, PostgreSQL, Redis, JWT, Bcrypt e Zod.

## Funcionalidades

- Registro e login de usuarios.
- Access token e refresh token em cookies `httpOnly`.
- Rotacao de sessao com `jti`.
- Logout com revogacao de sessao.
- Perfil autenticado em `GET /v1/user/me`.
- Rate limit com Redis.
- Validacao centralizada por `schemaName`.
- Estrutura em camadas: domain, application, infra, presentation e main.

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- PostgreSQL e Redis, caso rode sem Docker

## Variaveis De Ambiente

Use `.env.example` como base:

```env

POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=oauth_db
POSTGRES_PORT=5432

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_PORT}/${POSTGRES_DB}"

# Geralmente 10-12
BCRYPT_SALT=12

JWT_ACCESS_SECRET_KEY=your_access_secret
JWT_REFRESH_SECRET_KEY=your_refresh_secret

# Exemplos:
# 15m
# 1h
# 7d
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Milissegundos
ACCESS_TOKEN_COOKIE_MAX_AGE_MS=1200000
REFRESH_TOKEN_COOKIE_MAX_AGE_MS=864000000


PORT=8080

REDIS_URL=redis://redis:6379
REDIS_PORT=6379

```

## API: 
`http://localhost:3000/v1`

## Rodando Com Docker

Crie um `.env` a partir de `.env.example` e execute:

```bash
docker compose up --build
```



## Scripts

```bash
npm test
npm run lint
npm start
npm run dev
```

## Migrations

As migrations estao em `prisma/migrations`. A migration `20260521150356_restore_session_table` renomeia `sessions.user_id` para `sessions.id_user` sem dropar dados.

Para banco novo, use:

```bash
npx prisma migrate deploy
```

## Rotas

- `POST /v1/user/register`
- `POST /v1/login`
- `POST /v1/refresh`
- `POST /v1/logout`
- `GET /v1/user/me`
