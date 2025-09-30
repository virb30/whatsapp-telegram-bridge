export class TelegramQrEvent {
  public readonly status = 'qr';
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly qrCode: string,
  ) {}
}