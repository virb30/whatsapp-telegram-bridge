---
status: approved_with_comments
parallelizable: true
blocked_by: ["2.0"]
---

<task_context>
<domain>application/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>nestjs, typeorm, bcrypt, @nestjs/jwt, @nestjs/passport</dependencies>
<unblocks>["4.0", "5.0", "7.0"]</unblocks>
</task_context>

# Tarefa 3.0: Desenvolvimento do Core do Usuário (Backend)

## Visão Geral
Esta tarefa foca na implementação da lógica de negócio para o gerenciamento de usuários, incluindo cadastro e autenticação. Serão criados o `UserService` e os endpoints da API correspondentes, utilizando o `UserRepository` do TypeORM para armazenar e acessar os dados do usuário.

## Requisitos
- Implementar a funcionalidade de cadastro de novos usuários.
- Implementar a autenticação de usuários com JWT.
- Proteger os endpoints da API que exigem autenticação.

## Subtarefas
- [x] 3.1 Criar o `UserService` em `src/application/services` e injetar o `UserRepository`.
- [x] 3.2 Implementar o método `createUser` que realiza o hash da senha e salva o novo usuário usando o repositório.
- [x] 3.3 Implementar o método `findUserByEmail` usando o repositório.
- [x] 3.4 Configurar o módulo de autenticação do NestJS (`@nestjs/jwt` e `@nestjs/passport`).
- [x] 3.5 Criar o endpoint `POST /api/v1/users` para cadastro.
- [x] 3.6 Criar o endpoint `POST /api/v1/auth/login` que valida as credenciais e retorna um token JWT.
- [x] 3.7 Implementar um `JwtStrategy` e proteger os endpoints relevantes com um `AuthGuard`.

## Sequenciamento
- **Bloqueado por:** 2.0 (Configuração de CI/CD).
- **Desbloqueia:** 4.0 (Frontend - Cadastro e Login), 5.0 (Backend - Integração com WhatsApp), 7.0 (Backend - Integração com Telegram).
- **Paralelizável:** Sim.

## Detalhes de Implementação
- Utilizar a biblioteca `bcrypt` para fazer o hash das senhas.
- O `UserService` irá interagir diretamente com o `UserRepository` injetado para todas as operações de banco de dados relacionadas ao usuário.

## Critérios de Sucesso
- Um novo usuário pode ser criado com sucesso através da API.
- Um usuário cadastrado consegue obter um token JWT válido ao fazer login.
- Endpoints protegidos retornam erro 401 para requisições não autenticadas.
- Os dados do usuário são persistidos corretamente no banco de dados SQLite.