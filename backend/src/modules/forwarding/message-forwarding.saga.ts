import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ForwardMessageUseCase } from 'src/core/bridge/application/use-cases/forward-message/forward-message.use-case';
import {
  WHATSAPP_EVENTS,
  WhatsAppEventsInterface,
} from 'src/core/whatsapp/application/events/whatsapp.events';

@Injectable()
export class MessageForwardingSaga implements OnModuleInit {
  private readonly logger = new Logger(MessageForwardingSaga.name);

  constructor(
    private readonly forwardMessage: ForwardMessageUseCase,
    @Inject(WHATSAPP_EVENTS)
    private readonly whatsappEvents: WhatsAppEventsInterface,
  ) {}

  async onModuleInit(): Promise<void> {
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


