---
status: pending
parallelizable: false
blocked_by: ["2.0", "3.0", "5.0"]
---

<task_context>
<domain>engine/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>database</dependencies>
<unblocks>"6.0"</unblocks>
</task_context>

# Tarefa 4.0: Implementação do Encaminhador de Mensagens (`MessageForwarder`)

## Visão Geral
O `MessageForwarder` é o componente central que conecta o `WhatsappClient` e o `TelegramClient`. Ele recebe mensagens do WhatsApp, consulta o mapeamento de grupos e usa o cliente do Telegram para encaminhar a mensagem.

## Requisitos
- O `MessageForwarder` deve receber instâncias do `WhatsappClient` e `TelegramClient`.
- Ele deve se registrar para receber eventos de mensagem do `WhatsappClient`.
- Para cada mensagem, ele deve consultar o mapeamento de grupos para encontrar o destino no Telegram.
- Ele deve chamar o `TelegramClient` para enviar a mensagem formatada.

## Subtarefas
- [ ] 4.1 Criar a classe `MessageForwarder`.
- [ ] 4.2 Implementar a lógica para receber mensagens do `WhatsappClient`.
- [ ] 4.3 Implementar a consulta ao mapa de configuração de grupos.
- [ ] 4.4 Implementar a chamada ao `TelegramClient` para encaminhar a mensagem.
- [ ] 4.5 Adicionar logging detalhado para o fluxo de encaminhamento.
- [ ] 4.6 Criar testes unitários para o `MessageForwarder` com mocks.

## Sequenciamento
- Bloqueado por: 2.0, 3.0, 5.0
- Desbloqueia: 6.0
- Paralelizável: Não

## Critérios de Sucesso
- Mensagens recebidas do WhatsApp são corretamente encaminhadas para o Telegram.
- O encaminhador lida corretamente com mensagens de grupos não mapeados (ignorando-as).
- Os testes unitários cobrem a lógica de encaminhamento.
