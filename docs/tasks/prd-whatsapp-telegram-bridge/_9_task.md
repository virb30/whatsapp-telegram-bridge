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

# Tarefa 9.0: Desenvolvimento do Core da Ponte (Backend) - Arquitetura de Casos de Uso

## Visão Geral
Implementar os casos de uso para o gerenciamento de pontes (mapeamentos de grupo). Isso inclui a criação, listagem e exclusão de pontes, associando-as ao usuário autenticado, seguindo a arquitetura de casos de uso.

## Requisitos
- Permitir que um usuário autenticado crie um mapeamento entre um grupo do WhatsApp e um grupo do Telegram.
- Permitir que um usuário autenticado liste seus mapeamentos existentes.
- Permitir que um usuário autenticado exclua um de seus mapeamentos.

## Subtarefas
- [ ] 9.1 Criar o caso de uso `CreateBridgeUseCase`.
- [ ] 9.2 Criar o caso de uso `ListBridgesUseCase`.
- [ ] 9.3 Criar o caso de uso `DeleteBridgeUseCase`.
- [ ] 9.4 Implementar o `CreateBridgeUseCase` para salvar a nova ponte.
- [ ] 9.5 Implementar o `ListBridgesUseCase` para listar as pontes de um usuário.
- [ ] 9.6 Implementar o `DeleteBridgeUseCase` para excluir uma ponte, verificando a propriedade.
- [ ] 9.7 Criar os endpoints da API (protegidos por autenticação):
    - `POST /api/v1/bridges` (executa `CreateBridgeUseCase`).
    - `GET /api/v1/bridges` (executa `ListBridgesUseCase`).
    - `DELETE /api/v1/bridges/:id` (executa `DeleteBridgeUseCase`).

## Sequenciamento
- **Bloqueado por:** 3.0 (Desenvolvimento do Core do Usuário - Backend).
- **Desbloqueia:** 10.0 (Frontend - Gerenciamento de Pontes), 11.0 (Implementação do Serviço de Encaminhamento).
- **Paralelizável:** Não.

## Detalhes de Implementação
- Todas as operações de `Bridge` devem ser estritamente vinculadas ao `userId` para garantir a segurança e o isolamento dos dados (multi-tenant).
- Os casos de uso irão interagir com a camada de persistência através de uma interface `BridgeRepository`.

## Critérios de Sucesso
- Um usuário autenticado pode criar, listar e deletar suas próprias pontes através da API.
- A API impede que um usuário acesse ou modifique as pontes de outro usuário.
- Os dados das pontes são persistidos corretamente no banco de dados SQLite.