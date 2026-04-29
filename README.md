# 🛡️ Clean OAuth Core

Uma API de autenticação robusta e escalável construída com **Node.js**, seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. 

Este projeto foi desenvolvido com foco em alta testabilidade (TDD), integridade de domínio e segurança avançada.

---

## Funcionalidades Atuais

- [x] **Domínio Rico**: Entidades e Objetos de Valor (`Email`, `Password`, `Name`) com autovalidação.
- [x] **Gestão de Erros Semântica**: Sistema de códigos de erro (`DF400`, `AC409`) para facilitar a depuração. Veja a [documentação de erros](docs/ERRORS.md).
- [x] **Arquitetura Desacoplada**: Separação clara entre Regras de Negócio e Infraestrutura (Prisma/Express).
- [ ] **OAuth 2.0**: Fluxo completo de autenticação externa (Google/Github).
- [ ] **JWT & Refresh Tokens**: Gestão segura de sessões.
- [ ] **2FA (Two-Factor Authentication)**: Verificação de dois fatores via TOTP.

---

## Tecnologias e Ferramentas

- **Backend**: Node.js (ESModules)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: PostgreSQL (via Docker)
- **Testes**: [Jest](https://jestjs.io/)
- **Linting**: [ESLint](https://eslint.org/)

---

## Arquitetura

O projeto segue a **Clean Architecture**, dividida em:

1. **Domain**: Entidades, Value Objects e Regras de Negócio fundamentais.
2. **Application**: Casos de uso (Use Cases) que orquestram o fluxo de dados.
3. **Infrastructure**: Implementações técnicas (Persistência, Segurança, APIs Externas).
4. **Presentation**: Controladores e Rotas da API.

---

## Como Rodar o Projeto

### Pré-requisitos
- Docker

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/oauth-authentication.git
   ```
2. Configure o arquivo `.env` baseado no `.env.example`.

### Iniciando Aplicação com Docker

---

*Desenvolvido com ☕ e foco em Clean Code.*
