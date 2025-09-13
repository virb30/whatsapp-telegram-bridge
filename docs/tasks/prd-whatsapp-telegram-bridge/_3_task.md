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

# Tarefa 3.0: Implementação do Cliente WhatsApp (`WhatsappClient`)

## Visão Geral
Esta tarefa envolve a criação de um cliente para se conectar ao WhatsApp usando a biblioteca `whatsapp-web.js`. O cliente será responsável por gerenciar a sessão, incluindo a autenticação via QR code, e escutar por novas mensagens nos grupos configurados.

## Requisitos
- O cliente deve usar a biblioteca `whatsapp-web.js`.
- A autenticação deve ser feita exibindo um QR code no console.
- A sessão do WhatsApp deve ser persistida para evitar re-autenticações frequentes.
- O cliente deve emitir um evento quando uma nova mensagem `fromMe` for recebida em um grupo monitorado.

## Subtarefas
- [ ] 3.1 Instalar a dependência `whatsapp-web.js` e `qrcode-terminal`.
- [ ] 3.2 Criar a classe `WhatsappClient`.
- [ ] 3.3 Implementar a lógica de autenticação com QR code.
- [ ] 3.4 Implementar a persistência da sessão.
- [ ] 3.5 Implementar a escuta de mensagens e filtrar por `fromMe` e grupos configurados.
- [ ] 3.6 Implementar a extração de texto, imagens e links das mensagens.
- [ ] 3.7 Criar testes de integração para o `WhatsappClient`.

## Sequenciamento
- Bloqueado por: 1.0
- Desbloqueia: 4.0
- Paralelizável: Sim (pode ser feito em paralelo com a Tarefa 2.0)

## Critérios de Sucesso
- O `WhatsappClient` consegue se conectar ao WhatsApp com sucesso.
- O cliente detecta e processa novas mensagens enviadas pelo usuário nos grupos monitorados.
- A sessão é restaurada sem a necessidade de um novo QR code a cada inicialização.
