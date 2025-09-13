import { Telegraf } from 'telegraf';
import { ITelegramClient } from '../../../application/interfaces/telegram-client.interface';
import { MessageDTO } from '../../../application/dtos/message.dto';
import { TelegramChatId, TelegramError } from './telegram.types';

type TelegrafLike = {
  launch: () => Promise<void>;
  stop: () => Promise<void>;
  telegram: {
    sendMessage: (chatId: TelegramChatId, text: string) => Promise<unknown>;
    sendPhoto: (
      chatId: TelegramChatId,
      imageUrl: string,
      options: { caption?: string }
    ) => Promise<unknown>;
  };
};

export class TelegramClient implements ITelegramClient {
  private readonly botToken: string;
  private bot: TelegrafLike | null = null;

  constructor() {
    this.botToken = this.getBotToken();
  }

  public async initialize(): Promise<void> {
    try {
      const bot = new Telegraf(this.botToken) as unknown as TelegrafLike;
      this.bot = bot;
      await bot.launch();
    } catch (error) {
      throw new Error('Telegram client initialization failed');
    }
  }

  public async sendMessage(chatId: TelegramChatId, message: MessageDTO): Promise<void> {
    if (!this.bot) {
      throw new Error('Telegram client not initialized. Call initialize() first.');
    }

    try {
      if (message.text) {
        await this.sendText(chatId, message.text);
      }

      if (message.imageUrl) {
        const caption = message.text ? message.text : undefined;
        await this.sendImage(chatId, message.imageUrl, caption);
      }

      if (message.link) {
        await this.sendText(chatId, message.link);
      }
    } catch (error) {
      throw this.handleTelegramError(error);
    }
  }

  public async sendText(chatId: TelegramChatId, text: string): Promise<void> {
    if (!this.bot) {
      throw new Error('Telegram client not initialized. Call initialize() first.');
    }

    try {
      await this.bot.telegram.sendMessage(chatId, text);
    } catch (error) {
      throw this.handleTelegramError(error);
    }
  }

  public async sendImage(chatId: TelegramChatId, imageUrl: string, caption?: string): Promise<void> {
    if (!this.bot) {
      throw new Error('Telegram client not initialized. Call initialize() first.');
    }

    try {
      await this.bot.telegram.sendPhoto(chatId, imageUrl, { caption });
    } catch (error) {
      throw this.handleTelegramError(error);
    }
  }

  private getBotToken(): string {
    const token = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.TELEGRAM_BOT_TOKEN;

    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN environment variable is not set. ' +
        'Please set it with your Telegram bot token.'
      );
    }

    return token;
  }

  private handleTelegramError(error: unknown): Error {
    if (error instanceof Error) {
      const telegramError = error as TelegramError;

      if (telegramError.code === 401) {
        return new Error('Invalid Telegram bot token');
      }

      if (telegramError.code === 403) {
        return new Error('Bot is not authorized to send messages to this chat');
      }

      if (telegramError.code === 429) {
        return new Error('Too many requests. Rate limit exceeded');
      }

      if (telegramError.response?.statusCode === 400) {
        return new Error('Invalid request parameters');
      }

      return error;
    }

    return new Error('Unknown Telegram API error');
  }

  public async stop(): Promise<void> {
    if (this.bot) {
      await this.bot.stop();
      this.bot = null;
    }
  }
}
