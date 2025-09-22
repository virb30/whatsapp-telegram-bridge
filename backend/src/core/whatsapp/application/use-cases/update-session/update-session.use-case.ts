import { Inject, Injectable } from '@nestjs/common';
import {
  WHATSAPP_SESSION_REPOSITORY,
  type WhatsAppSessionRepositoryInterface,
} from '../../interfaces/whatsapp-session.repository';

export interface UpdateUserWhatsAppSessionInput {
  readonly userId: string;
  readonly sessionJson: string | null;
}

@Injectable()
export class UpdateUserWhatsAppSessionUseCase {
  constructor(
    @Inject(WHATSAPP_SESSION_REPOSITORY)
    private readonly userSessionRepository: WhatsAppSessionRepositoryInterface,
  ) {}

  async execute(input: UpdateUserWhatsAppSessionInput): Promise<void> {
    await this.userSessionRepository.setSessionJson(
      input.userId,
      input.sessionJson,
    );
  }
}
