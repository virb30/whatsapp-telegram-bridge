export class TelegramPasswordEvent {
  public readonly status = 'password';
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly hint?: string,
  ) {}
}