import { Message } from '../../domain/entities/message.entity';

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  findById(id: string): Promise<Message | null>;
}


