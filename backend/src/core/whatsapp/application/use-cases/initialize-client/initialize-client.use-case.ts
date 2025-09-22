import { Inject, Injectable } from '@nestjs/common';
import {
  type WhatsAppServiceInterface,
  WHATSAPP_SERVICE,
} from '../../interfaces/whatsapp.service';
import {
  type InitializeWhatsAppClientInput,
  type InitializeWhatsAppClientOutput,
} from './initialize-client.dto';
import {
  USER_REPOSITORY,
  type UserRepositoryInterface,
} from 'src/core/user/application/interfaces/user.repository';
import {
  WHATSAPP_SESSION_REPOSITORY,
  type WhatsAppSessionRepositoryInterface,
} from '../../interfaces/whatsapp-session.repository';
import {
  WHATSAPP_EVENTS,
  type WhatsAppEventsInterface,
} from '../../events/whatsapp.events';
import { WhatsAppGateway } from '../../gateway/whatsapp.gateway';

@Injectable()
export class InitializeWhatsAppClientUseCase {
  constructor(
    @Inject(WHATSAPP_SERVICE)
    private readonly whatsappService: WhatsAppServiceInterface,
    @Inject(WHATSAPP_SESSION_REPOSITORY)
    private readonly userSessionRepository: WhatsAppSessionRepositoryInterface,
    @Inject(WHATSAPP_EVENTS)
    private readonly events: WhatsAppEventsInterface,
    private readonly gateway: WhatsAppGateway,
  ) {}

  async execute(
    input: InitializeWhatsAppClientInput,
  ): Promise<InitializeWhatsAppClientOutput> {
    // Nota: buscamos a sessão via repositório de sessão para desacoplar do domínio
    const existingSession = await this.userSessionRepository.getSessionJson(
      input.userId,
    );
    const result = await this.whatsappService.initializeClient({
      userId: input.userId,
      sessionJson: existingSession ?? null,
    });
    // Conecta listener para mensagens
    this.gateway.attachListeners(input.userId);
    return { status: result.status, qrCode: result.qrCode };
  }
}
