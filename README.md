# 🛡️ Clean OAuth Core

Uma API de autenticação robusta e escalável construída com **Node.js**, seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. 

Este projeto foi desenvolvido com foco em alta testabilidade (TDD), integridade de domínio e segurança avançada.

---

## Funcionalidades Atuais

- [x] **Domínio Rico**: Entidades e Objetos de Valor (`Email`, `Password`, `Name`) com autovalidação e suporte a mutabilidade dinâmica de atributos.
- [x] **Gestão de Erros Semântica**: Sistema de códigos de erro (`DF400`, `AC409`, `AU401`) em inglês para fácil depuração. Veja a [documentação de erros](docs/ERRORS.md).
- [x] **Autenticação Local**: Registro e Login de usuários com criptografia Bcrypt.
- [x] **Proteção contra Timing Attack**: Implementação de lógica de comparação de hash resiliente a ataques de tempo no login.
- [x] **Arquitetura Desacoplada**: Separação clara entre Regras de Negócio e Infraestrutura (Prisma/Express) via Mappers e Repositórios baseados em Domínio.
- [ ] **JWT & Refresh Tokens**: Gestão segura de sessões (Em desenvolvimento).
- [ ] **OAuth 2.0**: Fluxo completo de autenticação externa (Google/Github).
- [ ] **2FA (Two-Factor Authentication)**: Verificação de dois fatores via TOTP.
- [ ] **Logging**: Datadog, Grafana Loki ou ELK Stack.
- [ ] **Validação de dados**: Zod.

---

## Tecnologias e Ferramentas

- **Backend**: Node.js (ESModules) / JavaScript
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: PostgreSQL (via Docker)
- **Segurança**: [Bcrypt](https://www.npmjs.com/package/bcrypt) para hashing e [JWT](https://jwt.io/) para autenticação.
- **Testes**: [Jest](https://jestjs.io/) (Unitários e Integração)
- **Linting**: [ESLint](https://eslint.org/)

---

## Arquitetura

O projeto segue a **Clean Architecture**, dividida em:

1. **Domain**: Entidades, Value Objects e Regras de Negócio fundamentais (Totalmente agnóstico a frameworks).
2. **Application**: Casos de uso (Use Cases) que orquestram o fluxo de dados e interfaces (Portas).
3. **Infrastructure**: Implementações técnicas (Persistência, Segurança, Mappers de Banco).
4. **Presentation**: Controladores e Rotas da API (Express).

---

## Como Rodar o Projeto

### Pré-requisitos
- Docker & Docker Compose
- Node.js (v18+)

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/oauth-authentication.git
   ```

2. Configure o arquivo `.env` baseado no `.env.example`.

3. Suba a aplicação:
   ```bash
   docker-compose up -d
   ```

---

*Desenvolvido com ☕ e foco em Clean Code.*
