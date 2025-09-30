export class TelegramErrorEvent {
  public readonly status = 'error';
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly error: string,
  ) {}
}