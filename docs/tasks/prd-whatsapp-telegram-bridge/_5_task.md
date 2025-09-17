---
status: pending
parallelizable: false
blocked_by: ["4.0"]
---

<task_context>
<domain>application/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>nestjs, typeorm</dependencies>
<unblocks>["6.0", "7.0"]</unblocks>
</task_context>

# Tarefa 5.0: Desenvolvimento do Core da Ponte

## Visão Geral
Implementar a lógica de negócio para o gerenciamento de pontes (mapeamentos de grupo). Isso inclui a criação, listagem e exclusão de pontes, associando-as ao usuário autenticado, usando o `BridgeRepository` do TypeORM.

## Requisitos
- Permitir que um usuário autenticado crie um mapeamento entre um grupo do WhatsApp e um grupo do Telegram.
- Permitir que um usuário autenticado liste seus mapeamentos existentes.
- Permitir que um usuário autenticado exclua um de seus mapeamentos.

## Subtarefas
- [ ] 5.1 Criar o `BridgeService` em `src/application/services` e injetar o `BridgeRepository`.
- [ ] 5.2 Implementar o método `createBridge(userId, whatsappGroupId, telegramGroupId)` que salva a nova ponte usando o repositório.
- [ ] 5.3 Implementar o método `getBridgesForUser(userId)` usando o repositório.
- [ ] 5.4 Implementar o método `deleteBridge(bridgeId, userId)` que verifica a propriedade antes de excluir.
- [ ] 5.5 Criar o endpoint `POST /api/v1/bridges` (protegido por autenticação).
- [ ] 5.6 Criar o endpoint `GET /api/v1/bridges` (protegido por autenticação).
- [ ] 5.7 Criar o endpoint `DELETE /api/v1/bridges/:id` (protegido por autenticação).

## Sequenciamento
- **Bloqueado por:** 4.0 (Desenvolvimento do Core do Usuário).
- **Desbloqueia:** 6.0 (Desenvolvimento do Frontend) e 7.0 (Implementação do Serviço de Encaminhamento).
- **Paralelizável:** Não.

## Detalhes de Implementação
- Todas as operações de `Bridge` devem ser estritamente vinculadas ao `userId` para garantir a segurança e o isolamento dos dados (multi-tenant).
- O `BridgeService` irá interagir diretamente com o `BridgeRepository` injetado.

## Critérios de Sucesso
- Um usuário autenticado pode criar, listar e deletar suas próprias pontes através da API.
- A API impede que um usuário acesse ou modifique as pontes de outro usuário.
- Os dados das pontes são persistidos corretamente no banco de dados SQLite.
