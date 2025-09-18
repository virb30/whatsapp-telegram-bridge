export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly whatsappSession?: string;
  readonly telegramSession?: string;

  constructor(params: {
    id: string;
    email: string;
    passwordHash: string;
    whatsappSession?: string;
    telegramSession?: string;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.whatsappSession = params.whatsappSession;
    this.telegramSession = params.telegramSession;
  }
}
