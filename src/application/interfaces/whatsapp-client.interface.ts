import { MessageDTO } from '../dtos/message.dto';

export interface IWhatsappClient {
  initialize(): Promise<void>;
  onMessage(callback: (message: MessageDTO) => void): void;
}


