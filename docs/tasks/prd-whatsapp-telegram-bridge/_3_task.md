---
status: pending
parallelizable: true
blocked_by: ["1.0"]
---

<task_context>
<domain>infra/integration</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>gram.js</dependencies>
<unblocks>["7.0"]</unblocks>
</task_context>

# Tarefa 3.0: Integração com Telegram

## Visão Geral
Implementar o `TelegramClient` usando a biblioteca `gram.js` para permitir que a aplicação atue como um cliente de usuário do Telegram. Esta tarefa cobre o complexo fluxo de autenticação (número de telefone, código de verificação, senha 2FA) e a funcionalidade de envio de mensagens para grupos.

## Requisitos
- Implementar a inicialização do cliente Telegram.
- Gerenciar o fluxo de autenticação interativo.
- Persistir e restaurar a sessão do cliente.
- Implementar uma função para enviar mensagens a um grupo específico.

## Subtarefas
- [ ] 3.1 Adicionar a dependência `gram.js` ao projeto.
- [ ] 3.2 Criar o `TelegramService` em `src/infrastructure/services`.
- [ ] 3.3 Implementar o método `initializeClient` que lida com a autenticação.
- [ ] 3.4 Desenvolver os endpoints da API para o fluxo de login:
    - `POST /api/v1/telegram/connect` (para enviar o número de telefone).
    - `POST /api/v1/telegram/signin` (para enviar o código e a senha 2FA).
- [ ] 3.5 Implementar a lógica para salvar e carregar a sessão do Telegram (`stringSession`) no campo `telegramSession` da entidade `User` usando o `UserRepository`.
- [ ] 3.6 Criar um método `sendMessage(groupId, message)`.
- [ ] 3.7 Implementar o tratamento de erros para senhas 2FA incorretas ou códigos de login inválidos.

## Sequenciamento
- **Bloqueado por:** 1.0 (Configuração do Backend e Persistência).
- **Desbloqueia:** 7.0 (Implementação do Serviço de Encaminhamento).
- **Paralelizável:** Sim, pode ser desenvolvida em paralelo com a tarefa 2.0 e 4.0.

## Detalhes de Implementação
- A sessão do Telegram (`stringSession`) deve ser associada ao `userId`.
- O `TelegramService` precisará armazenar temporariamente o `phoneCodeHash` retornado pela API entre as chamadas de `connect` e `signin`.

## Critérios de Sucesso
- O usuário consegue se autenticar com sucesso através dos endpoints da API.
- A sessão do Telegram é persistida e restaurada corretamente.
- O método `sendMessage` envia com sucesso uma mensagem para um grupo do Telegram.
