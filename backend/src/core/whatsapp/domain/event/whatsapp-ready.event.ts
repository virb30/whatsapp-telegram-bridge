export class WhatsAppReadyEvent {
  public readonly status = 'ready';
  constructor(
    public readonly userId: string,
  ) {}
}