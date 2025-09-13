import { Client as WaWebClient, Message as WaWebMessage } from 'whatsapp-web.js';
import { IWhatsappClient } from '../../../application/interfaces/whatsapp-client.interface';
import { MessageDTO } from '../../../application/dtos/message.dto';

export class WhatsappClient implements IWhatsappClient {
  private client: WaWebClient;
  private messageHandler: ((message: MessageDTO) => void) | null = null;

  constructor() {
    this.client = new WaWebClient({});
  }

  public async initialize(): Promise<void> {
    try {
      this.client.on('message_create', (message: WaWebMessage) => {
        this.onWhatsAppMessage(message);
      });

      await this.client.initialize();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Whatsapp client initialization failed: ${errorMessage}`);
    }
  }

  public onMessage(callback: (message: MessageDTO) => void): void {
    this.messageHandler = callback;
  }

  private onWhatsAppMessage(waMessage: WaWebMessage): void {
    if (!waMessage.fromMe) return;

    const dto: MessageDTO = {
      id: waMessage.id._serialized,
      from: waMessage.from,
      to: waMessage.to,
      text: waMessage.body,
    };

    if (this.messageHandler) {
      this.messageHandler(dto);
    }
  }
}


