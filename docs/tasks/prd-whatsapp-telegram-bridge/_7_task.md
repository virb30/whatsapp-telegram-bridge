---
status: pending
parallelizable: true
blocked_by: ["3.0"]
---

<task_context>
<domain>infra/integration</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>gram.js</dependencies>
<unblocks>["8.0"]</unblocks>
</task_context>

# Tarefa 7.0: Integração com Telegram (Backend) - Arquitetura de Casos de Uso

## Visão Geral
Implementar os casos de uso e a infraestrutura para a integração com o Telegram usando a biblioteca `gram.js`. Esta tarefa cobre o fluxo de autenticação e a funcionalidade de envio de mensagens, seguindo a arquitetura de casos de uso.

## Requisitos
- Implementar a inicialização do cliente Telegram.
- Gerenciar o fluxo de autenticação interativo.
- Persistir e restaurar a sessão do cliente.
- Implementar uma função para enviar mensagens a um grupo específico.

## Subtarefas
- [ ] 7.1 Adicionar a dependência `gram.js` ao projeto.
- [ ] 7.2 Criar o caso de uso `ConnectTelegramUseCase` para iniciar a conexão e enviar o número de telefone.
- [ ] 7.3 Criar o caso de uso `SignInTelegramUseCase` para completar a autenticação com o código e a senha 2FA.
- [ ] 7.4 Criar o caso de uso `SendMessageToTelegramUseCase` para enviar mensagens a um grupo específico.
- [ ] 7.5 Desenvolver os endpoints da API para o fluxo de login:
    - `POST /api/v1/telegram/connect` (executa `ConnectTelegramUseCase`).
    - `POST /api/v1/telegram/signin` (executa `SignInTelegramUseCase`).
- [ ] 7.6 Implementar a lógica para salvar e carregar a sessão do Telegram (`stringSession`) através de um caso de uso `UpdateUserTelegramSessionUseCase`.
- [ ] 7.7 Implementar o tratamento de erros nos casos de uso para senhas 2FA incorretas ou códigos de login inválidos.

## Sequenciamento
- **Bloqueado por:** 3.0 (Desenvolvimento do Core do Usuário - Backend).
- **Desbloqueia:** 8.0 (Desenvolvimento do Frontend - Conexão Telegram).
- **Paralelizável:** Sim.

## Detalhes de Implementação
- A sessão do Telegram (`stringSession`) deve ser associada ao `userId`.
- Os casos de uso devem gerenciar o estado do fluxo de autenticação, possivelmente usando um repositório temporário ou cache para armazenar o `phoneCodeHash`.

## Critérios de Sucesso
- O usuário consegue se autenticar com sucesso através dos endpoints da API.
- A sessão do Telegram é persistida e restaurada corretamente.
- O `SendMessageToTelegramUseCase` envia com sucesso uma mensagem para um grupo do Telegram.