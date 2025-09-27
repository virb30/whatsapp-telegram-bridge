import { EventEmitter2 } from "@nestjs/event-emitter";
import { WhatsAppServiceInterface, WhatsAppStatus } from "../../application/interfaces/whatsapp-service.interface";
import { Client, LocalAuth } from "whatsapp-web.js";
import { Injectable } from "@nestjs/common";


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
      this.eventEmitter.emit('whatsapp.status', {
        status: 'qr',
        qrCode: qr,
      } as WhatsAppStatus);
      oldQr = qr;
    }); 

    client.on('ready', () => {
      this.clients.set(userId, client);
      this.eventEmitter.emit('whatsapp.status', {
        status: 'ready',
      } as WhatsAppStatus);
    });

    client.on('auth_failure', () => {
      this.eventEmitter.emit('whatsapp.status', {
        status: 'auth_failure',
      } as WhatsAppStatus);
    });

    client.on('disconnected', () => {
      this.clients.delete(userId);
      this.eventEmitter.emit('whatsapp.status', {
        status: 'disconnected',
      } as WhatsAppStatus);
    });
  }
}