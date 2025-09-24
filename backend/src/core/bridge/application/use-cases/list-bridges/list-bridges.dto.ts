export interface ListBridgesInput {
  readonly userId: string;
}

export interface ListBridgesItem {
  readonly id: string;
  readonly whatsappGroupId: string;
  readonly telegramGroupId: string;
}

export interface ListBridgesOutput {
  readonly items: ListBridgesItem[];
}



