---
status: pending
parallelizable: false
blocked_by: ["5.0", "7.0", "9.0"]
---

<task_context>
<domain>application/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>nestjs, typeorm</dependencies>
<unblocks>["12.0"]</unblocks>
</task_context>

# Tarefa 11.0: Implementação do Encaminhamento de Mensagens (Backend) - Arquitetura de Casos de Uso

## Visão Geral
Esta é a tarefa central que conecta todas as partes do sistema. Será desenvolvido um processo de background que escuta as mensagens do WhatsApp, verifica se a mensagem veio de um grupo mapeado e do usuário correto, e a encaminha para o grupo correspondente no Telegram, utilizando casos de uso para cada etapa.

## Requisitos
- O serviço deve ser iniciado junto com a aplicação NestJS.
- O serviço deve obter todos os mapeamentos de pontes ativas.
- Para cada ponte, o serviço deve escutar mensagens no grupo do WhatsApp especificado.
- Ao receber uma mensagem, deve verificar se o autor é o usuário dono da ponte.
- Se as condições forem atendidas, a mensagem (texto, imagem ou link) deve ser enviada ao grupo do Telegram correspondente.

## Subtarefas
- [ ] 11.1 Criar um `MessageForwardingSaga` ou um processo de background que orquestra o encaminhamento de mensagens.
- [ ] 11.2 No início da aplicação (`OnModuleInit`), o processo deve carregar todas as pontes ativas usando o `ListBridgesUseCase`.
- [ ] 11.3 Para cada ponte, registrar um listener no `WhatsAppGateway` para o grupo de WhatsApp correspondente.
- [ ] 11.4 Ao receber uma mensagem, o `WhatsAppGateway` dispara um evento `WhatsAppMessageReceived`.
- [ ] 11.5 O `MessageForwardingSaga` escuta o evento `WhatsAppMessageReceived` e executa um `ForwardMessageUseCase`.
- [ ] 11.6 O `ForwardMessageUseCase` implementa a lógica de verificação: checa se a mensagem é de um grupo mapeado e se o autor é o dono da ponte.
- [ ] 11.7 Se as condições forem atendidas, o `ForwardMessageUseCase` chama o `SendMessageToTelegramUseCase` com o `telegramGroupId` e o conteúdo da mensagem.
- [ ] 11.8 Adicionar tratamento para diferentes tipos de mensagem (texto, imagem, link) no `ForwardMessageUseCase`.
- [ ] 11.9 Implementar logs detalhados para cada mensagem processada.

## Sequenciamento
- **Bloqueado por:** 5.0 (Backend - Integração com WhatsApp), 7.0 (Backend - Integração com Telegram), 9.0 (Backend - Desenvolvimento do Core da Ponte).
- **Desbloqueia:** 12.0 (Testes, Containerização e Implantação).
- **Paralelizável:** Não.

## Detalhes de Implementação
- O processo de encaminhamento deve ser robusto a falhas. Se uma das integrações (WhatsApp/Telegram) de um usuário estiver offline, isso não deve afetar o encaminhamento para outros usuários.
- O encaminhamento de imagens pode exigir o download do buffer da imagem do WhatsApp e o envio desse buffer para o Telegram.

## Critérios de Sucesso
- Mensagens de texto enviadas pelo usuário correto em um grupo mapeado do WhatsApp são encaminhadas para o Telegram.
- Mensagens de imagem e links também são encaminhadas corretamente.
- Mensagens de outros usuários no mesmo grupo do WhatsApp não são encaminhadas.
- O serviço lida graciosamente com erros de conexão ou falhas no envio, registrando logs apropriados.