# Padrão de Comunicação entre Camadas

Este documento define as diretrizes para a transferência de dados e chamadas entre as diferentes camadas da nossa arquitetura (Apresentação, Aplicação, Domínio e Infraestrutura), assegurando um baixo acoplamento e padronização.

## 1. Regra Geral de Passagem de Parâmetros
Para manter uma estrutura uniforme e flexível, todas as injeções de dependências e chamadas de métodos (com múltiplas propriedades ou dados complexos) devem receber os **parâmetros como objetos destruturados**. 

**Exemplo:**
```javascript
// Ruim ❌
constructor(userRepository, hashProvider) {}
async create(userEntity, transaction) {}

// Bom ✅
constructor({ userRepository, hashProvider }) {}
async create({ userEntity, transaction }) {}
```

---

## 2. Padrões por Camada

### Camada de Apresentação (Presentation) -> Aplicação (Application)
Os Controladores ou Middlewares são responsáveis por interpretar a requisição HTTP (ou outro meio de entrada) e montar um DTO de Requisição (**Request DTO**).
* **Entrada:** O caso de uso recebe o Request DTO via método de execução.
* **Saída:** O caso de uso processa e retorna um **Response DTO** para a camada de apresentação.

**Fluxo Esperado:**
```javascript
// Controller
const requestDTO = new CreateUserRequestDTO({ 
    name: req.body.name, 
    email: req.body.email, 
    password: req.body.password 
});

const responseDTO = await createUserUseCase.execute(requestDTO);

return res.status(201).json(responseDTO);
```

### Camada de Aplicação (Application) -> Domínio (Domain)
A camada de aplicação (Use Cases) manipula Entidades de Domínio para garantir o respeito às regras de negócio.
* A aplicação cria instâncias da Entidade passando dados brutos ou extraídos do Request DTO.
* Modifica o estado através de métodos da Entidade (ex: `userEntity.updatePassword({ hashedPassword })`).

### Camada de Aplicação (Application) -> Infraestrutura (Infrastructure)
A camada de aplicação comunica-se com a Infraestrutura (Repositórios e Provedores) sempre através de **Interfaces**.
* **Entrada no Repositório:** Envia-se a própria Entidade de Domínio ou valores extraídos dela.
* **Retorno do Repositório:** A infraestrutura pode retornar o objeto de persistência cru (ex: dado direto do Prisma) ou converter para uma Entidade/DTO. Em nosso padrão, se o repositório retorna dados do banco, o **Caso de Uso** (ou um Mapper no repositório) converte os dados para o formato seguro antes de enviar ao Controller.

**Exemplo (Uso Seguro em UseCase):**
```javascript
// Aplicação chama a interface implementada pela infra
const savedData = await this.userRepository.create({ userEntity });

// A aplicação converte o retorno para um DTO seguro
return new CreateUserResponseDTO({
    id: savedData.id,
    name: savedData.name,
    email: savedData.email
});
```

---

## 3. Data Transfer Objects (DTOs)
Os DTOs estão localizados em `src/application/dtos`.

**Tipos:**
1. **Request DTOs** (ex: `CreateUserRequestDTO.js`): Padronizam a entrada dos dados da rota pro Use Case.
2. **Response DTOs** (ex: `CreateUserResponseDTO.js`): Removem dados sensíveis (senhas, informações internas de banco) antes de retornar para o usuário final.
