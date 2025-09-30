import { Inject, Injectable } from "@nestjs/common";
import { TELEGRAM_SERVICE } from "../../interfaces/telegram-service.interface";
import { TelegramServiceInterface } from "../../interfaces/telegram-service.interface";
import { InitializeTelegramClientInput } from "./initialize-client.input";
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class InitializeTelegramClientUseCase {
  constructor(
    @Inject(TELEGRAM_SERVICE)
    private readonly telegramService: TelegramServiceInterface,
  ) {}

  async execute(input: InitializeTelegramClientInput): Promise<void> {
    const sessionId = uuidv7();
    await this.telegramService.initializeClient({ userId: input.userId, sessionId });
  }
}