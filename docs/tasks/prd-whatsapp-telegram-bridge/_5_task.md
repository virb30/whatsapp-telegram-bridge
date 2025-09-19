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
<dependencies>whatsapp-web.js</dependencies>
<unblocks>["6.0"]</unblocks>
</task_context>

# Tarefa 5.0: Integração com WhatsApp (Backend)

## Visão Geral
Esta tarefa consiste em implementar o `WhatsAppClient`, um adaptador que encapsula a biblioteca `whatsapp-web.js`. O serviço será responsável por gerenciar a conexão com a conta do WhatsApp do usuário, incluindo autenticação via QR code, persistência de sessão e escuta de novas mensagens.

## Requisitos
- Implementar a inicialização do cliente WhatsApp.
- Gerar e expor um QR code para o frontend.
- Persistir e restaurar a sessão do cliente para evitar logins repetidos.
- Escutar por novas mensagens nos grupos em que o usuário está.

## Subtarefas
- [ ] 5.1 Adicionar a dependência `whatsapp-web.js` ao projeto.
- [ ] 5.2 Criar o `WhatsAppService` em `src/infrastructure/services`.
- [ ] 5.3 Implementar o método `initializeClient` que lida com a geração de QR code e o evento de 'ready'.
- [ ] 5.4 Implementar a lógica para salvar a sessão (string JSON) no campo `whatsappSession` da entidade `User` usando o `UserRepository`.
- [ ] 5.5 Implementar a lógica para carregar a sessão de um arquivo ao inicializar o cliente.
- [ ] 5.6 Criar um método `onMessage` que recebe um handler para processar as mensagens recebidas.
- [ ] 5.7 Desenvolver um endpoint na API (`GET /api/v1/whatsapp/qr`) que retorna o QR code como uma string base64.

## Sequenciamento
- **Bloqueado por:** 3.0 (Desenvolvimento do Core do Usuário - Backend).
- **Desbloqueia:** 6.0 (Desenvolvimento do Frontend - Conexão WhatsApp).
- **Paralelizável:** Sim.

## Detalhes de Implementação
- A sessão do WhatsApp deve ser associada ao `userId` para suportar múltiplos usuários.
- O tratamento de erros para eventos de desconexão (`disconnected`) é crucial e deve ser logado.

## Critérios de Sucesso
- O frontend consegue obter um QR code da API.
- Após escanear o QR code, a sessão do WhatsApp é estabelecida e persistida.
- Em reinicializações do servidor, a sessão é restaurada sem a necessidade de um novo QR code.
- Novas mensagens enviadas nos grupos do usuário são capturadas pelo `onMessage` handler.