export interface ForwardMessageInput {
  readonly userId: string;
  readonly chatId: string;
  readonly fromMe: boolean;
  readonly body?: string;
  readonly photoBase64?: string;
  readonly timestamp: number;
}


