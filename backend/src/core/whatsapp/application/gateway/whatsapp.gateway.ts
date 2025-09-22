import { Inject, Injectable, Logger } from '@nestjs/common';
import { WHATSAPP_EVENTS, type WhatsAppEventsInterface } from '../events/whatsapp.events';
import { WHATSAPP_SERVICE, type WhatsAppServiceInterface } from '../interfaces/whatsapp.service';

@Injectable()
export class WhatsAppGateway {
  private readonly logger = new Logger(WhatsAppGateway.name);

  constructor(
    @Inject(WHATSAPP_EVENTS)
    private readonly events: WhatsAppEventsInterface,
    @Inject(WHATSAPP_SERVICE)
    private readonly whats: WhatsAppServiceInterface,
  ) {}

  attachListeners(userId: string): void {
    this.whats.onMessage(userId, (payload) => {
      // Apenas mensagens do próprio usuário interessam no MVP
      if (!payload.fromMe) return;
      this.events.emitIncomingMessage({
        userId,
        chatId: payload.chatId,
        fromMe: payload.fromMe,
        body: payload.body,
        timestamp: payload.timestamp,
      });
      this.logger.debug(`Forward candidate from ${userId} in ${payload.chatId}`);
    });
  }
}


