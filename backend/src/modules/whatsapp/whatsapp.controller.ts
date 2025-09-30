import {
  Controller,
  MessageEvent,
  Param,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { map, Observable, fromEvent } from 'rxjs';
import { InitializeWhatsAppClientUseCase } from 'src/core/whatsapp/application/use-cases/initialize-client/initialize-client.use-case';
import { WhatsAppStatus } from 'src/core/whatsapp/application/interfaces/whatsapp-service.interface';


@Controller('whatsapp')
export class WhatsAppController {
  constructor(
    private readonly initializeWhatsAppClientUseCase: InitializeWhatsAppClientUseCase,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(JwtAuthGuard)
  @Sse('status/:userId')
  getStatus(@Param('userId') userId: string): Observable<MessageEvent> {
    const observable = fromEvent(this.eventEmitter, 'whatsapp.status').pipe(
      map<unknown, MessageEvent>((args: unknown) => {
        const data = args as WhatsAppStatus;
        return {
          data,
          type: 'whatsapp.status',
        };
      })
    );
    void this.initializeWhatsAppClientUseCase.execute({ userId });
    return observable;
  }
}
