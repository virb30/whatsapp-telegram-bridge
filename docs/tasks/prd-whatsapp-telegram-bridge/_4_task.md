---
status: completed
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

# Tarefa 4: Implementar Clientes (Adapters) de WhatsApp e Telegram na Camada de Infraestrutura

**Descrição:**
O objetivo desta tarefa é criar as implementações concretas dos clientes que já funcionem como adapters entre as interfaces da camada de aplicação e as bibliotecas externas. Ou seja, `WhatsappClient` deve adaptar `IWhatsappClient` para `whatsapp-web.js`, e `TelegramClient` deve adaptar `ITelegramClient` para `telegraf`.

**Critérios de Aceitação:**
- [x] Implementar a classe `WhatsappClient` que implementa `IWhatsappClient`, adaptando a biblioteca `whatsapp-web.js`.
- [x] Implementar a classe `TelegramClient` que implementa `ITelegramClient`, adaptando a biblioteca `telegraf`.
- [x] A lógica de conexão, envio e recebimento de mensagens deve estar encapsulada nos clientes.
- [x] Os clientes devem estar localizados no diretório `src/infrastructure/clients`.
- [x] Renomear `http-clients` para `clients` e atualizar imports e README.

---

- [x] 4.0 Tarefa 4: Implementar Clientes (Adapters) de WhatsApp e Telegram na Camada de Infraestrutura ✅ CONCLUÍDA
  - [x] 4.1 Implementação completada
  - [x] 4.2 Definição da tarefa, PRD e tech spec validados
  - [x] 4.3 Análise de regras e conformidade verificadas
  - [x] 4.4 Revisão de código completada
  - [x] 4.5 Pronto para deploy
