---
status: done
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

# Tarefa 5.0: Integração com WhatsApp (Backend) - Arquitetura de Casos de Uso

## Visão Geral
Esta tarefa consiste em implementar os casos de uso e a infraestrutura para a integração com o WhatsApp. Serão criados os componentes necessários para gerenciar a conexão com a conta do WhatsApp do usuário, incluindo autenticação via QR code, persistência de sessão e escuta de novas mensagens, seguindo a arquitetura de casos de uso.

## Requisitos
- Implementar a inicialização do cliente WhatsApp.
- Gerar e expor um QR code para o frontend.
- Persistir e restaurar a sessão do cliente para evitar logins repetidos.
- Escutar por novas mensagens nos grupos em que o usuário está.

## Subtarefas
- [x] 5.1 Adicionar a dependência `whatsapp-web.js` ao projeto.
- [x] 5.2 Criar o caso de uso `InitializeWhatsAppClientUseCase` para gerenciar a inicialização do cliente e a geração do QR code.
- [x] 5.3 Criar o caso de uso `UpdateUserWhatsAppSessionUseCase` para salvar a sessão do WhatsApp associada ao usuário.
- [x] 5.4 Implementar a lógica no `InitializeWhatsAppClientUseCase` para carregar a sessão do usuário ao inicializar o cliente.
- [x] 5.5 Criar um `WhatsAppGateway` que escuta por novas mensagens e dispara um evento ou chama um caso de uso para processá-las.
- [x] 5.6 Desenvolver um endpoint na API (`GET /api/v1/whatsapp/qr`) que executa o `InitializeWhatsAppClientUseCase` e retorna o QR code.
- [x] 5.7 Implementar a persistência da sessão do cliente no `UpdateUserWhatsAppSessionUseCase`, atualizando a entidade `User`.

## Sequenciamento
- **Bloqueado por:** 3.0 (Desenvolvimento do Core do Usuário - Backend).
- **Desbloqueia:** 6.0 (Desenvolvimento do Frontend - Conexão WhatsApp).
- **Paralelizável:** Sim.

## Detalhes de Implementação
- A sessão do WhatsApp deve ser associada ao `userId` para suportar múltiplos usuários.
- Os casos de uso devem interagir com a camada de domínio e infraestrutura através de interfaces (repositórios, gateways).
- O tratamento de erros para eventos de desconexão (`disconnected`) é crucial e deve ser logado.

## Critérios de Sucesso
- O frontend consegue obter um QR code da API.
- Após escanear o QR code, a sessão do WhatsApp é estabelecida e persistida.
- Em reinicializações do servidor, a sessão é restaurada sem a necessidade de um novo QR code.
- Novas mensagens enviadas nos grupos do usuário são capturadas e processadas.