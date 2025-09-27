import { Controller, MessageEvent, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { map, Observable, fromEvent } from 'rxjs';
import { Client, LocalAuth } from 'whatsapp-web.js';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(
     private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(JwtAuthGuard)
  @Sse('status')
  async getStatus(): Promise<Observable<MessageEvent>> {

    const client = new Client({
      authStrategy: new LocalAuth(),
      qrMaxRetries: 3,
      authTimeoutMs: 60000,
      deviceName: 'Bridge',
    });

    let oldQr: string | null = null;
    client.on('qr', (qr) => {
      if (oldQr === qr) return;
      this.eventEmitter.emit('whatsapp.status', {
        status: 'qr',
        qrCode: qr,
      });
      oldQr = qr;
    }); 

    client.on('authenticated', () => {
      this.eventEmitter.emit('whatsapp.status', {
        status: 'authenticated',
      });
    });

    client.on('ready', () => {
      this.eventEmitter.emit('whatsapp.status', {
        status: 'ready',
      });
    });

    client.on('auth_failure', () => {
      this.eventEmitter.emit('whatsapp.status', {
        status: 'auth_failure',
      });
    });

    client.on('disconnected', () => {
      this.eventEmitter.emit('whatsapp.status', {
        status: 'disconnected',
      });
    });

    client.initialize();

    return fromEvent(this.eventEmitter, 'whatsapp.status').pipe(
      map<unknown, MessageEvent>((args: unknown) => {
        console.log('getStatus', args);
        const status = args as { status: string };
        return {
          data: status,
          type: 'whatsapp.status',
        };
      })
    );
  }
}
