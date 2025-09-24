export const TELEGRAM_SESSION_REPOSITORY = Symbol(
  'TELEGRAM_SESSION_REPOSITORY',
);

export interface TelegramSessionRepositoryInterface {
  getSessionString(userId: string): Promise<string | null>;
  setSessionString(userId: string, session: string | null): Promise<void>;
}


