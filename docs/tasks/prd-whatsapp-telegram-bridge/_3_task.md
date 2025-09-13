---
status: pending
parallelizable: true
blocked_by: ["1.0"]
---

<task_context>
<domain>engine/integration/whatsapp</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>external_apis</dependencies>
<unblocks>"4.0"</unblocks>
</task_context>

# Tarefa 3: Implementar os Casos de Uso (Use Cases) na Camada de Aplicação

**Descrição:**
Nesta tarefa, serão implementados os casos de uso que orquestram a lógica da aplicação. Os casos de uso dependerão das interfaces (portas) definidas na camada de aplicação e não terão conhecimento sobre as implementações concretas da camada de infraestrutura.

**Critérios de Aceitação:**
- [ ] Implementar o caso de uso `ForwardMessageUseCase` para encaminhar uma mensagem.
- [ ] O caso de uso deve receber um DTO de entrada, utilizar as interfaces dos clientes de mensagem e do repositório, e retornar um DTO de saída.
- [ ] A lógica de negócio do encaminhamento, como a identificação do grupo de destino, deve estar contida neste caso de uso.
- [ ] Os casos de uso devem estar localizados no diretório `src/application/use-cases`.
