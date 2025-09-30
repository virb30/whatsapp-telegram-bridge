export const TELEGRAM_SERVICE = Symbol('TELEGRAM_SERVICE');

export interface TelegramStatus {
  status: 'ready' | 'qr' | 'error' | 'password';
  hint?: string;
  qrCode?: string;
  error?: string;
  sessionId?: string;
}

export interface SubmitPasswordInput {
  sessionId: string;
  userId: string;
  password: string;
}

export interface InitializeClientInput {
  userId: string;
  sessionId: string;
}

export interface TelegramServiceInterface {
  initializeClient(input: InitializeClientInput): Promise<void>;
  submitPassword(input: SubmitPasswordInput): void;
}