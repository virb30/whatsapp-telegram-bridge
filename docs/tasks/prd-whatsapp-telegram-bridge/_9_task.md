---
status: pending
parallelizable: false
blocked_by: ["3.0"]
---

<task_context>
<domain>application/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>nestjs, typeorm</dependencies>
<unblocks>["10.0", "11.0"]</unblocks>
</task_context>

# Tarefa 9.0: Desenvolvimento do Core da Ponte (Backend)

## Visão Geral
Implementar a lógica de negócio para o gerenciamento de pontes (mapeamentos de grupo). Isso inclui a criação, listagem e exclusão de pontes, associando-as ao usuário autenticado, usando o `BridgeRepository` do TypeORM.

## Requisitos
- Permitir que um usuário autenticado crie um mapeamento entre um grupo do WhatsApp e um grupo do Telegram.
- Permitir que um usuário autenticado liste seus mapeamentos existentes.
- Permitir que um usuário autenticado exclua um de seus mapeamentos.

## Subtarefas
- [ ] 9.1 Criar o `BridgeService` em `src/application/services` e injetar o `BridgeRepository`.
- [ ] 9.2 Implementar o método `createBridge(userId, whatsappGroupId, telegramGroupId)` que salva a nova ponte usando o repositório.
- [ ] 9.3 Implementar o método `getBridgesForUser(userId)` usando o repositório.
- [ ] 9.4 Implementar o método `deleteBridge(bridgeId, userId)` que verifica a propriedade antes de excluir.
- [ ] 9.5 Criar o endpoint `POST /api/v1/bridges` (protegido por autenticação).
- [ ] 9.6 Criar o endpoint `GET /api/v1/bridges` (protegido por autenticação).
- [ ] 9.7 Criar o endpoint `DELETE /api/v1/bridges/:id` (protegido por autenticação).

## Sequenciamento
- **Bloqueado por:** 3.0 (Desenvolvimento do Core do Usuário - Backend).
- **Desbloqueia:** 10.0 (Frontend - Gerenciamento de Pontes), 11.0 (Implementação do Serviço de Encaminhamento).
- **Paralelizável:** Não.

## Detalhes de Implementação
- Todas as operações de `Bridge` devem ser estritamente vinculadas ao `userId` para garantir a segurança e o isolamento dos dados (multi-tenant).
- O `BridgeService` irá interagir diretamente com o `BridgeRepository` injetado.

## Critérios de Sucesso
- Um usuário autenticado pode criar, listar e deletar suas próprias pontes através da API.
- A API impede que um usuário acesse ou modifique as pontes de outro usuário.
- Os dados das pontes são persistidos corretamente no banco de dados SQLite.