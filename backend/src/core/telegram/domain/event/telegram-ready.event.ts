export class TelegramReadyEvent {
  public readonly status = 'ready';
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
  ) {}
}