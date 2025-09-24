export const TELEGRAM_LOGIN_STATE_REPOSITORY = Symbol(
  'TELEGRAM_LOGIN_STATE_REPOSITORY',
);

export interface TelegramLoginState {
  readonly userId: string;
  readonly phoneCodeHash: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TelegramLoginStateRepositoryInterface {
  getByUserId(userId: string): Promise<TelegramLoginState | null>;
  upsert(userId: string, phoneCodeHash: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}


