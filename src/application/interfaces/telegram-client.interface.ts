import { MessageDTO } from '../dtos/message.dto';

export interface ITelegramClient {
  initialize(): Promise<void>;
  sendMessage(chatId: string | number, message: MessageDTO): Promise<void>;
  sendText(chatId: string | number, text: string): Promise<void>;
  sendImage(chatId: string | number, imageUrl: string, caption?: string): Promise<void>;
}


