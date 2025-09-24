import { Inject, Injectable } from '@nestjs/common';
import {
  TELEGRAM_SERVICE,
  type TelegramServiceInterface,
} from '../../interfaces/telegram.service';

export interface SignInTelegramInputDto {
  readonly userId: string;
  readonly phone: string;
  readonly code: string;
  readonly password?: string;
}

@Injectable()
export class SignInTelegramUseCase {
  constructor(
    @Inject(TELEGRAM_SERVICE)
    private readonly telegram: TelegramServiceInterface,
  ) {}

  async execute(input: SignInTelegramInputDto) {
    return await this.telegram.signIn({
      userId: input.userId,
      phone: input.phone,
      code: input.code,
      password: input.password,
    });
  }
}


