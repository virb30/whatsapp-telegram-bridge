import { MessageDTO } from './message.dto';

export interface ForwardMessageInputDTO {
  message: MessageDTO;
}

export interface ForwardMessageOutputDTO {
  delivered: boolean;
  targetChatId?: string | number;
  errorMessage?: string;
}


