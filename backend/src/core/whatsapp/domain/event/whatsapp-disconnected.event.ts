export class WhatsAppDisconnectedEvent {
  public readonly status = 'disconnected';
  constructor(
    public readonly userId: string,
  ) {}
}