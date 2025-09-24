import { Inject, Injectable } from '@nestjs/common';
import {
  TELEGRAM_SERVICE,
  type TelegramServiceInterface,
} from '../../interfaces/telegram.service';

export interface ConnectTelegramInputDto {
  readonly userId: string;
  readonly phone: string;
}

@Injectable()
export class ConnectTelegramUseCase {
  constructor(
    @Inject(TELEGRAM_SERVICE)
    private readonly telegram: TelegramServiceInterface,
  ) {}

  async execute(input: ConnectTelegramInputDto) {
    return await this.telegram.connect({ userId: input.userId, phone: input.phone });
  }
}


