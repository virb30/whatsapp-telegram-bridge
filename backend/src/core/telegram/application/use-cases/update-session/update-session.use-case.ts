import { Inject, Injectable } from '@nestjs/common';
import {
  TELEGRAM_SESSION_REPOSITORY,
  type TelegramSessionRepositoryInterface,
} from '../../interfaces/telegram-session.repository';

export interface UpdateUserTelegramSessionInput {
  readonly userId: string;
  readonly session: string | null;
}

@Injectable()
export class UpdateUserTelegramSessionUseCase {
  constructor(
    @Inject(TELEGRAM_SESSION_REPOSITORY)
    private readonly repo: TelegramSessionRepositoryInterface,
  ) {}

  async execute(input: UpdateUserTelegramSessionInput): Promise<void> {
    await this.repo.setSessionString(input.userId, input.session);
  }
}


