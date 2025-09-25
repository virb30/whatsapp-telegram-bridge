import { EventEmitter } from 'events';

export type WhatsAppIncomingMessage = {
  readonly userId: string;
  readonly chatId: string;
  readonly fromMe: boolean;
  readonly body: string;
  readonly photoBase64?: string;
  readonly timestamp: number;
};

export const WHATSAPP_EVENTS = Symbol('WHATSAPP_EVENTS');

export interface WhatsAppEventsInterface {
  emitIncomingMessage(message: WhatsAppIncomingMessage): void;
  onIncomingMessage(listener: (message: WhatsAppIncomingMessage) => void): void;
}

export class WhatsAppEvents implements WhatsAppEventsInterface {
  private readonly emitter = new EventEmitter();

  emitIncomingMessage(message: WhatsAppIncomingMessage): void {
    this.emitter.emit('incoming_message', message);
  }

  onIncomingMessage(
    listener: (message: WhatsAppIncomingMessage) => void,
  ): void {
    this.emitter.on('incoming_message', listener);
  }
}
