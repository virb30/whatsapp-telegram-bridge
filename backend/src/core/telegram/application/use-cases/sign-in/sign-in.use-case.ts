import { Inject, Injectable } from '@nestjs/common';

import { SignInTelegramInputDto } from './sign-in.input';
import { TELEGRAM_SERVICE, TelegramServiceInterface } from '../../interfaces/telegram-service.interface';

@Injectable()
export class SignInTelegramUseCase {
  constructor(
    @Inject(TELEGRAM_SERVICE)
    private readonly telegramService: TelegramServiceInterface,
  ) {}

  execute(input: SignInTelegramInputDto) {
    return this.telegramService.submitPassword({
      sessionId: input.sessionId,
      userId: input.userId,
      password: input.password,
    });
  }
}


