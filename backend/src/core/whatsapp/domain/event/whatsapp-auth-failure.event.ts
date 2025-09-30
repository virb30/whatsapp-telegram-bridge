export class WhatsAppAuthFailureEvent {
  public readonly status = 'auth_failure';
  constructor(
    public readonly userId: string,
  ) {}
}