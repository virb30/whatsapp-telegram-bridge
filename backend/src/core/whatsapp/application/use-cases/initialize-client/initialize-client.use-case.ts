import { Inject, Injectable } from '@nestjs/common';
import {
  type WhatsAppServiceInterface,
  WHATSAPP_SERVICE,
} from '../../interfaces/whatsapp-service.interface';
import {
  type InitializeWhatsAppClientInput,
} from './initialize-client.input';

@Injectable()
export class InitializeWhatsAppClientUseCase {
  constructor(
    @Inject(WHATSAPP_SERVICE)
    private readonly whatsappService: WhatsAppServiceInterface,
  ) {}

  execute(input: InitializeWhatsAppClientInput): void {
    this.whatsappService.initializeClient(input.userId);
  }
}
