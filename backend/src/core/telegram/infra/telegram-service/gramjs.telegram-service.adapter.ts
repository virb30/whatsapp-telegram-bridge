import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { InitializeClientInput, SubmitPasswordInput, TelegramServiceInterface } from "../../application/interfaces/telegram-service.interface";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TelegramErrorEvent } from "../../domain/event/telegram-error.event";
import { TelegramReadyEvent } from "../../domain/event/telegram-ready.event";
import { TelegramQrEvent } from "../../domain/event/telegram-qr.event";
import { TelegramPasswordEvent } from "../../domain/event/telegram-password.event";


const EVENT_NAME = 'telegram.status';

@Injectable()
export class GramJsTelegramServiceAdapter implements TelegramServiceInterface {

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private clients: Map<string, TelegramClient> = new Map();
  private passwordPromises: Map<string, (password: string) => void> = new Map();

  async initializeClient({ userId, sessionId }: InitializeClientInput): Promise<void> {
    const { apiHash, apiId } = this.getCredentials();
   
    let session = new StringSession("");
    if (this.clients.has(userId)) {
      session = new StringSession(this.clients.get(userId)?.session.save() ?? "");
    }

    const client = new TelegramClient(session, apiId, apiHash, { 
      connectionRetries: 5,
    });

    try {
      await client.connect();
      const isAuthorized =await client.checkAuthorization();

      if (isAuthorized) {
        this.clients.set(userId, client);
        await this.eventEmitter.emitAsync('telegram.status', new TelegramReadyEvent(userId, sessionId));
        return;
      }

      const user = await client.signInUserWithQrCode({
        apiId,
        apiHash,
      }, {
        qrCode: async (qrCode) => {
          await this.eventEmitter.emitAsync('telegram.status', new TelegramQrEvent(userId, sessionId, this.generateQrCodeLink(qrCode.token)));
        },
        password: async (hint?: string) => {
          await this.eventEmitter.emitAsync('telegram.status', new TelegramPasswordEvent(userId, sessionId, hint));
          const password = await new Promise<string>((resolve) => {
            this.passwordPromises.set(this.getSessionKey(userId, sessionId), resolve);
          });
          return password;
        },
        onError: async (error: Error) => {
          await this.eventEmitter.emitAsync('telegram.status', new TelegramErrorEvent(userId, sessionId, error.message));
          return true;
        },
      });
      if (user) {
        this.clients.set(userId, client);
        await this.eventEmitter.emitAsync('telegram.status', new TelegramReadyEvent(userId, sessionId));
      }
    } catch (error) {
      await this.eventEmitter.emitAsync('telegram.status', new TelegramErrorEvent(userId, sessionId, error instanceof Error ? error.message : String(error)));;
    } finally {
      this.clients.set(userId, client);
      this.deleteSessionPromise(userId, sessionId);
      await this.eventEmitter.emitAsync('telegram.status', new TelegramReadyEvent(userId, sessionId));
    }
  }

  submitPassword({ sessionId, userId, password }: SubmitPasswordInput) {
    const resolvePromise = this.passwordPromises.get(this.getSessionKey(userId, sessionId));
    if (resolvePromise) {
      resolvePromise(password);
      this.deleteSessionPromise(userId, sessionId);
    }
  }

  private getCredentials() {
    let apiId = this.configService.get('TELEGRAM_API_ID');
    const apiHash = this.configService.get('TELEGRAM_API_HASH');

    if (!apiId || !apiHash) {
      throw new Error('Telegram not configured');
    }

    apiId = parseInt(apiId);
    return { apiId, apiHash };
  }

  private generateQrCodeLink(qrCodeToken: Buffer): string {
    return `tg://login?token=${qrCodeToken.toString("base64url")}`;
  } 

  private getSessionKey(userId: string, sessionId: string): string {
    return `${sessionId}:${userId}`;
  }

  private deleteSessionPromise(userId: string, sessionId: string): void {
    this.passwordPromises.delete(this.getSessionKey(userId, sessionId));
  }
}