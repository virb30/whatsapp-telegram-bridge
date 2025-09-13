import { MessageDTO } from '../dtos/message.dto';

export interface IMessageRepository {
  save(message: MessageDTO): Promise<void>;
  findById(id: string): Promise<MessageDTO | null>;
}


