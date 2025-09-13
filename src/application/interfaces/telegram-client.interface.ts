import { Message } from '../../domain/entities/message.entity';

export interface ITelegramClient {
  initialize(): Promise<void>;
  sendMessage(chatId: string | number, message: Message): Promise<void>;
  sendText(chatId: string | number, text: string): Promise<void>;
  sendImage(chatId: string | number, imageUrl: string, caption?: string): Promise<void>;
}


