import { Inject, Injectable } from '@nestjs/common';
import {
  type ConnectTelegramParams,
  type ConnectTelegramResult,
  type SendMessageToTelegramParams,
  type SignInTelegramParams,
  type SignInTelegramResult,
  type TelegramServiceInterface,
  type TelegramStatus,
} from '../../application/interfaces/telegram.service';
import {
  TELEGRAM_SESSION_REPOSITORY,
  type TelegramSessionRepositoryInterface,
} from '../../application/interfaces/telegram-session.repository';
import { UpdateUserTelegramSessionUseCase } from '../../application/use-cases/update-session/update-session.use-case';
import {
  TELEGRAM_LOGIN_STATE_REPOSITORY,
  type TelegramLoginStateRepositoryInterface,
} from '../../application/interfaces/telegram-login-state.repository';

// Tipagens mínimas locais para evitar dependência direta de tipos da lib
interface TelegramSessionLike {
  save(): string;
}

interface TelegramClientLike {
  readonly apiId: number;
  readonly apiHash: string;
  readonly connected: boolean;
  readonly session: TelegramSessionLike;
  connect(): Promise<void>;
  sendCode(input: {
    apiId: number;
    apiHash: string;
    phoneNumber: string;
  }): Promise<{ phoneCodeHash: string }>;
  signIn(input: {
    phoneNumber: string;
    phoneCode: string;
    phoneCodeHash: string;
    password?: string;
  }): Promise<void>;
  sendMessage(entity: string, message: { message: string }): Promise<void>;
}

@Injectable()
export class GramJsTelegramService implements TelegramServiceInterface {
  private readonly userIdToClient: Map<string, TelegramClientLike> = new Map();
  // Removido: estado em memória do phoneCodeHash

  constructor(
    @Inject(TELEGRAM_SESSION_REPOSITORY)
    private readonly sessions: TelegramSessionRepositoryInterface,
    private readonly updateUserTelegramSession: UpdateUserTelegramSessionUseCase,
    @Inject(TELEGRAM_LOGIN_STATE_REPOSITORY)
    private readonly loginStateRepo: TelegramLoginStateRepositoryInterface,
  ) {}

  private async getClient(userId: string): Promise<TelegramClientLike> {
    let client = this.userIdToClient.get(userId);
    if (client) return client;

    const tg = (await import('telegram')) as unknown as {
      TelegramClient: new (
        session: unknown,
        apiId: number,
        apiHash: string,
        options: { connectionRetries: number },
      ) => TelegramClientLike;
    };
    const sessionsMod = (await import('telegram/sessions')) as unknown as {
      StringSession: new (session: string) => unknown;
    };
    const { TelegramClient } = tg;
    const { StringSession } = sessionsMod;

    const sessionString = await this.sessions.getSessionString(userId);
    const stringSession = new StringSession(sessionString ?? '');

    const apiIdStr = process.env.TELEGRAM_API_ID;
    const apiHash = process.env.TELEGRAM_API_HASH;
    if (!apiIdStr || !apiHash) {
      throw new Error('TELEGRAM_API_ID/TELEGRAM_API_HASH not configured');
    }
    const apiId = Number(apiIdStr);

    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    this.userIdToClient.set(userId, client);
    return client;
  }

  async connect(params: ConnectTelegramParams): Promise<ConnectTelegramResult> {
    const client = await this.getClient(params.userId);
    await client.connect();
    const result = await client.sendCode({
      apiId: client.apiId,
      apiHash: client.apiHash,
      phoneNumber: params.phone,
    });
    await this.loginStateRepo.upsert(params.userId, result.phoneCodeHash);
    return { status: 'code_requested' };
  }

  async signIn(params: SignInTelegramParams): Promise<SignInTelegramResult> {
    const client = await this.getClient(params.userId);
    const state = await this.loginStateRepo.getByUserId(params.userId);
    const phoneCodeHash = state?.phoneCodeHash ?? null;
    if (!phoneCodeHash) {
      throw new Error('No code request found for this user');
    }
    try {
      await client.signIn({
        phoneNumber: params.phone,
        phoneCode: params.code,
        phoneCodeHash,
        password: params.password,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === 'PASSWORD_HASH_INVALID') {
        return { status: 'invalid_2fa_password' };
      }
      if (message === 'PHONE_CODE_INVALID') {
        return { status: 'invalid_code' };
      }
      throw err;
    }
    const session = client.session.save();
    await this.updateUserTelegramSession.execute({
      userId: params.userId,
      session,
    });
    await this.loginStateRepo.deleteByUserId(params.userId);
    return { status: 'ready' };
  }

  async sendMessage(params: SendMessageToTelegramParams): Promise<void> {
    const client = await this.getClient(params.userId);
    await client.sendMessage(params.groupId, { message: params.message });
  }

  async getStatus(userId: string): Promise<TelegramStatus> {
    try {
      const client = await this.getClient(userId);
      return client.connected ? 'ready' : 'disconnected';
    } catch {
      return 'error';
    }
  }
}


