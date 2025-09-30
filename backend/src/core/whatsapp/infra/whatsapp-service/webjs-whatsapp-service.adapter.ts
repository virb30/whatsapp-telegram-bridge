import { EventEmitter2 } from "@nestjs/event-emitter";
import { WhatsAppServiceInterface } from "../../application/interfaces/whatsapp-service.interface";
import { Client, LocalAuth } from "whatsapp-web.js";
import { Injectable } from "@nestjs/common";
import { WhatsAppQrEvent } from "../../domain/event/whatsapp-qr.event";
import { WhatsAppReadyEvent } from "../../domain/event/whatsapp-ready.event";
import { WhatsAppAuthFailureEvent } from "../../domain/event/whatsapp-auth-failure.event";
import { WhatsAppDisconnectedEvent } from "../../domain/event/whatsapp-disconnected.event";

const EVENT_NAME = 'whatsapp.status';

@Injectable()
export class WebjsWhatsAppServiceAdapter implements WhatsAppServiceInterface {

  private clients: Map<string, Client> = new Map();

  constructor(
    private readonly eventEmitter: EventEmitter2
  ) { }

  initializeClient(userId: string): void {
    let client: Client | undefined = this.clients.get(userId);
    if (!client) {
      client = new Client({
        authStrategy: new LocalAuth({
          clientId: userId,
        }),
        qrMaxRetries: 3,
        authTimeoutMs: 60000,
        deviceName: 'Bridge',
      });
    }

    this.registerListeners(client, userId);

    client.initialize();
  } 

  private registerListeners(client: Client, userId: string): void {
    let oldQr: string | null = null;    
    client.on('qr', (qr) => {
      if (oldQr === qr) return;
      this.eventEmitter.emit(EVENT_NAME, new WhatsAppQrEvent(userId, qr));
      oldQr = qr;
    }); 

    client.on('ready', () => {
      this.clients.set(userId, client);
      this.eventEmitter.emit(EVENT_NAME, new WhatsAppReadyEvent(userId));
    });

    client.on('auth_failure', () => {
      this.eventEmitter.emit(EVENT_NAME, new WhatsAppAuthFailureEvent(userId));
    });

    client.on('disconnected', () => {
      this.clients.delete(userId);
      this.eventEmitter.emit(EVENT_NAME, new WhatsAppDisconnectedEvent(userId));
    });
  }
}