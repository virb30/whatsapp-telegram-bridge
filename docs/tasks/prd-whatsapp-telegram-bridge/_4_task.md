---
status: pending
parallelizable: true
blocked_by: ["1.0"]
---

<task_context>
<domain>application/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>nestjs, typeorm</dependencies>
<unblocks>["5.0", "6.0"]</unblocks>
</task_context>

# Tarefa 4.0: Desenvolvimento do Core do Usuário

## Visão Geral
Esta tarefa foca na implementação da lógica de negócio para o gerenciamento de usuários, incluindo cadastro e autenticação. Serão criados o `UserService` e os endpoints da API correspondentes, utilizando o `UserRepository` do TypeORM para armazenar e acessar os dados do usuário.

## Requisitos
- Implementar a funcionalidade de cadastro de novos usuários.
- Implementar a autenticação de usuários com JWT.
- Proteger os endpoints da API que exigem autenticação.

## Subtarefas
- [ ] 4.1 Criar o `UserService` em `src/application/services` e injetar o `UserRepository`.
- [ ] 4.2 Implementar o método `createUser` que realiza o hash da senha e salva o novo usuário usando o repositório.
- [ ] 4.3 Implementar o método `findUserByEmail` usando o repositório.
- [ ] 4.4 Configurar o módulo de autenticação do NestJS (`@nestjs/jwt` e `@nestjs/passport`).
- [ ] 4.5 Criar o endpoint `POST /api/v1/users` para cadastro.
- [ ] 4.6 Criar o endpoint `POST /api/v1/auth/login` que valida as credenciais e retorna um token JWT.
- [ ] 4.7 Implementar um `JwtStrategy` e proteger os endpoints relevantes com um `AuthGuard`.

## Sequenciamento
- **Bloqueado por:** 1.0 (Configuração do Backend e Banco de Dados).
- **Desbloqueia:** 5.0 (Desenvolvimento do Core da Ponte) e 6.0 (Desenvolvimento do Frontend).
- **Paralelizável:** Sim, pode ser desenvolvida em paralelo com as tarefas 2.0 e 3.0.

## Detalhes de Implementação
- Utilizar a biblioteca `bcrypt` para fazer o hash das senhas.
- O `UserService` irá interagir diretamente com o `UserRepository` injetado para todas as operações de banco de dados relacionadas ao usuário.

## Critérios de Sucesso
- Um novo usuário pode ser criado com sucesso através da API.
- Um usuário cadastrado consegue obter um token JWT válido ao fazer login.
- Endpoints protegidos retornam erro 401 para requisições não autenticadas.
- Os dados do usuário são persistidos corretamente no banco de dados SQLite.
