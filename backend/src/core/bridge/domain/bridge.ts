export class Bridge {
  readonly id: string;
  readonly userId: string;
  readonly whatsappGroupId: string;
  readonly telegramGroupId: string;
  readonly createdAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    whatsappGroupId: string;
    telegramGroupId: string;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.whatsappGroupId = params.whatsappGroupId;
    this.telegramGroupId = params.telegramGroupId;
    this.createdAt = params.createdAt;
  }
}
