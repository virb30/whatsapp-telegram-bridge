import { Inject, Injectable } from '@nestjs/common';
import {
  TELEGRAM_SERVICE,
  type TelegramServiceInterface,
} from '../../interfaces/telegram.service';

export interface SendMessageToTelegramInputDto {
  readonly userId: string;
  readonly groupId: string;
  readonly message?: string;
  readonly photoBase64?: string;
  readonly caption?: string;
}

@Injectable()
export class SendMessageToTelegramUseCase {
  constructor(
    @Inject(TELEGRAM_SERVICE)
    private readonly telegram: TelegramServiceInterface,
  ) {}

  async execute(input: SendMessageToTelegramInputDto): Promise<void> {
    await this.telegram.sendMessage({
      userId: input.userId,
      groupId: input.groupId,
      message: input.message,
      photoBase64: input.photoBase64,
      caption: input.caption,
    });
  }
}


