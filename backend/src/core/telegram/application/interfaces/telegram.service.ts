export const TELEGRAM_SERVICE = Symbol('TELEGRAM_SERVICE');

export type TelegramStatus = 'ready' | 'connecting' | 'disconnected' | 'error';

export interface ConnectTelegramParams {
  readonly userId: string;
  readonly phone: string;
}

export interface ConnectTelegramResult {
  readonly status: 'code_requested';
}

export interface SignInTelegramParams {
  readonly userId: string;
  readonly phone: string;
  readonly code: string;
  readonly password?: string;
}

export type SignInTelegramResult =
  | { readonly status: 'ready' }
  | { readonly status: 'invalid_2fa_password' }
  | { readonly status: 'invalid_code' };

export interface SendMessageToTelegramParams {
  readonly userId: string;
  readonly groupId: string;
  readonly message?: string;
  readonly photoBase64?: string; // base64 sem prefixo data URL
  readonly caption?: string;
}

export interface TelegramServiceInterface {
  connect(params: ConnectTelegramParams): Promise<ConnectTelegramResult>;
  signIn(params: SignInTelegramParams): Promise<SignInTelegramResult>;
  sendMessage(params: SendMessageToTelegramParams): Promise<void>;
  getStatus(userId: string): Promise<TelegramStatus>;
}


