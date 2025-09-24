export interface CreateBridgeInput {
  readonly userId: string;
  readonly whatsappGroupId: string;
  readonly telegramGroupId: string;
}

export interface CreateBridgeOutput {
  readonly id: string;
}



