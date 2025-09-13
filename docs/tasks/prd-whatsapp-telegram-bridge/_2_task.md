---
status: pending
parallelizable: true
blocked_by: ["1.0"]
---

<task_context>
<domain>engine/design/architecture</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies></dependencies>
<unblocks>"3.0", "4.0"</unblocks>
</task_context>

# Tarefa 2: Definição do Domínio e Camada de Aplicação

**Descrição:**
Esta tarefa foca em estabelecer as fundações da arquitetura da aplicação, definindo as entidades e value objects do domínio, bem como as interfaces (portas) e DTOs da camada de aplicação. Este passo é crucial para garantir um baixo acoplamento e alta coesão, seguindo os princípios do DDD e da Clean Architecture.

**Critérios de Aceitação:**

**Domínio:**
- [ ] Criar a entidade `Message`, que representará uma mensagem a ser encaminhada. A entidade deve incluir atributos como `id`, `from`, `to`, `body` e `mediaUrl`.
- [ ] Criar os value objects necessários, como `GroupId` e `ContactId`, para garantir a consistência e validação dos identificadores.
- [ ] As entidades e value objects devem estar localizados no diretório `src/domain`.
- [ ] As regras de negócio, como a validação do formato dos IDs, devem ser implementadas dentro dos value objects.

**Aplicação:**
- [ ] Criar a interface `IMessageRepository` com os métodos necessários para a persistência de mensagens (ex: `save`, `findById`).
- [ ] Criar as interfaces para os clientes de mensagens, como `IWhatsappClient` e `ITelegramClient`.
- [ ] Definir os DTOs para entrada e saída dos casos de uso, como `ForwardMessageInput` e `ForwardMessageOutput`.
- [ ] As interfaces e DTOs devem estar localizados no diretório `src/application`.
