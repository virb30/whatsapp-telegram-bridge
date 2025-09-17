---
status: pending
parallelizable: false
blocked_by: ["2.0", "3.0", "5.0"]
---

<task_context>
<domain>application/core</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>nestjs, typeorm</dependencies>
<unblocks>[]</unblocks>
</task_context>

# Tarefa 7.0: Implementação do Serviço de Encaminhamento

## Visão Geral
Esta é a tarefa central que conecta todas as partes do sistema. Será desenvolvido um serviço de background que escuta as mensagens do `WhatsAppClient`, verifica se a mensagem veio de um grupo mapeado e do usuário correto, e a encaminha para o grupo correspondente no Telegram usando o `TelegramClient`.

## Requisitos
- O serviço deve ser iniciado junto com a aplicação NestJS.
- O serviço deve obter todos os mapeamentos de pontes ativas usando o `BridgeRepository`.
- Para cada ponte, o serviço deve escutar mensagens no grupo do WhatsApp especificado.
- Ao receber uma mensagem, deve verificar se o autor é o usuário dono da ponte, consultando o `UserRepository`.
- Se as condições forem atendidas, a mensagem (texto, imagem ou link) deve ser enviada ao grupo do Telegram correspondente.

## Subtarefas
- [ ] 7.1 Criar um `ForwardingService` em `backend/src/application/services` e injetar o `BridgeRepository` e o `UserRepository`.
- [ ] 7.2 No início da aplicação (`OnModuleInit`), o serviço deve carregar todas as pontes ativas usando o `BridgeRepository`.
- [ ] 7.3 Para cada ponte, registrar um listener no `WhatsAppService` para o grupo de WhatsApp correspondente.
- [ ] 7.4 Implementar a lógica de verificação: checar se a mensagem é de um grupo mapeado e se o `message.author` corresponde ao `userId` da ponte, buscando o usuário no `UserRepository`.
- [ ] 7.5 Implementar a lógica de encaminhamento: chamar o método `sendMessage` do `TelegramService` com o `telegramGroupId` e o conteúdo da mensagem.
- [ ] 7.6 Adicionar tratamento para diferentes tipos de mensagem (texto, imagem, link).
- [ ] 7.7 Implementar logs detalhados para cada mensagem processada, indicando sucesso ou falha no encaminhamento.

## Sequenciamento
- **Bloqueado por:** 2.0 (Integração com WhatsApp), 3.0 (Integração com Telegram) e 5.0 (Core da Ponte).
- **Desbloqueia:** Nenhuma.
- **Paralelizável:** Não.

## Detalhes de Implementação
- O serviço deve ser robusto a falhas. Se uma das integrações (WhatsApp/Telegram) de um usuário estiver offline, isso não deve afetar o encaminhamento para outros usuários.
- O encaminhamento de imagens pode exigir o download do buffer da imagem do WhatsApp e o envio desse buffer para o Telegram.

## Critérios de Sucesso
- Mensagens de texto enviadas pelo usuário correto em um grupo mapeado do WhatsApp são encaminhadas para o Telegram.
- Mensagens de imagem e links também são encaminhadas corretamente.
- Mensagens de outros usuários no mesmo grupo do WhatsApp não são encaminhadas.
- O serviço lida graciosamente com erros de conexão ou falhas no envio, registrando logs apropriados.
