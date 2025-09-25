import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ListAllBridgesUseCase } from 'src/core/bridge/application/use-cases/list-all-bridges/list-all-bridges.use-case';
import { ForwardMessageUseCase } from 'src/core/bridge/application/use-cases/forward-message/forward-message.use-case';
import {
  WHATSAPP_EVENTS,
  type WhatsAppEventsInterface,
} from 'src/core/whatsapp/application/events/whatsapp.events';
import { WhatsAppGateway } from 'src/core/whatsapp/application/gateway/whatsapp.gateway';

@Injectable()
export class MessageForwardingSaga implements OnModuleInit {
  private readonly logger = new Logger(MessageForwardingSaga.name);

  constructor(
    private readonly listAllBridges: ListAllBridgesUseCase,
    private readonly forwardMessage: ForwardMessageUseCase,
    private readonly whatsappGateway: WhatsAppGateway,
    @Inject(WHATSAPP_EVENTS)
    private readonly whatsappEvents: WhatsAppEventsInterface,
  ) {}

  async onModuleInit(): Promise<void> {
    const bridges = await this.listAllBridges.execute();
    const users = new Set(bridges.map((b) => b.userId));
    users.forEach((userId) => {
      this.whatsappGateway.attachListeners(userId);
      this.logger.log(`WhatsApp listeners attached for user ${userId}`);
    });

    this.whatsappEvents.onIncomingMessage(async (msg) => {
      try {
        await this.forwardMessage.execute({
          userId: msg.userId,
          chatId: msg.chatId,
          fromMe: msg.fromMe,
          body: msg.body,
          photoBase64: msg.photoBase64,
          timestamp: msg.timestamp,
        });
      } catch (err) {
        this.logger.error(
          `Failed to forward message userId=${msg.userId} chatId=${msg.chatId}`,
          err as Error,
        );
      }
    });
  }
}


