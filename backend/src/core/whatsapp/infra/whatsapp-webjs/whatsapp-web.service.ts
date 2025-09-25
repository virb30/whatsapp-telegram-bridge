import { Inject, Injectable } from '@nestjs/common';
import {
  type InitializeClientParams,
  type InitializeClientResult,
  type WhatsAppServiceInterface,
} from '../../application/interfaces/whatsapp.service';
import { UpdateUserWhatsAppSessionUseCase } from '../../application/use-cases/update-session/update-session.use-case';
import {
  WHATSAPP_SESSION_REPOSITORY,
  type WhatsAppSessionRepositoryInterface,
} from '../../application/interfaces/whatsapp-session.repository';
import { DatabaseStore } from './database.store';

// Lazy import para evitar custos em testes que não usam a lib
// Evitar any: definimos as assinaturas mínimas necessárias
type WhatsAppClientInstance = {
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  initialize: () => Promise<void>;
};
type WhatsAppClientType = new (opts: { authStrategy: unknown }) => WhatsAppClientInstance;
type LocalAuthType = new (opts: { clientId: string }) => unknown;
type RemoteAuthType = new (opts: { clientId: string; store: object; backupSyncIntervalMs?: number }) => unknown;

let WhatsAppClientLib: WhatsAppClientType | undefined;
let LocalAuthLib: LocalAuthType | undefined;
let RemoteAuthLib: RemoteAuthType | undefined;

@Injectable()
export class WhatsAppWebJsService implements WhatsAppServiceInterface {
  constructor(
    private readonly updateSession: UpdateUserWhatsAppSessionUseCase,
    @Inject(WHATSAPP_SESSION_REPOSITORY)
    private readonly sessionRepo: WhatsAppSessionRepositoryInterface,
  ) {}
  private userIdToClient: Map<string, WhatsAppClientInstance> = new Map();

  async initializeClient(
    params: InitializeClientParams,
  ): Promise<InitializeClientResult> {
    if (!WhatsAppClientLib || !LocalAuthLib || !RemoteAuthLib) {
      const w = await import('whatsapp-web.js');
      WhatsAppClientLib = (w as unknown as { Client: WhatsAppClientType })
        .Client;
      LocalAuthLib = (w as unknown as { LocalAuth: LocalAuthType }).LocalAuth;
      RemoteAuthLib = (w as unknown as { RemoteAuth?: RemoteAuthType })
        .RemoteAuth;
    }

    let client: WhatsAppClientInstance | undefined = this.userIdToClient.get(params.userId);
    if (client) {
      return { status: 'ready' };
    }

    const events: { qr?: string } = {};

    // RemoteAuth (recomendado). Fallback para LocalAuth caso indisponível.
    if (RemoteAuthLib) {
      const userId = params.userId;
      const store = new DatabaseStore(
        this.sessionRepo,
        userId,
        params.sessionJson ?? null,
      ) as unknown as object;

      client = new WhatsAppClientLib({
        authStrategy: new RemoteAuthLib({
          clientId: userId,
          store,
          backupSyncIntervalMs: 60000,
        }),
      });
    } else {
      client = new WhatsAppClientLib({
        authStrategy: new LocalAuthLib({ clientId: params.userId }),
      });
    }

    client.on('qr', ((qr: string) => {
      events.qr = qr;
    }) as unknown as (...args: unknown[]) => void);

    // Eventos úteis para controle de sessão
    client.on('authenticated', (async () => {
      // Com RemoteAuth, a persistência acontece via store.save
      // No fallback LocalAuth não há JSON disponível; apenas garantimos que existe sessão local
    }) as unknown as (...args: unknown[]) => void);
    client.on('disconnected', (async () => {
      try {
        await this.updateSession.execute({
          userId: params.userId,
          sessionJson: null,
        });
      } catch {
        // ignore
      }
    }) as unknown as (...args: unknown[]) => void);

    await client.initialize();
    this.userIdToClient.set(params.userId, client);

    if (events.qr) {
      // Retornamos o QR cru; controller pode converter para SVG/PNG/DataURL
      return { status: 'qr', qrCode: events.qr };
    }
    return { status: 'ready' };
  }

  onMessage(
    userId: string,
    handler: (payload: {
      chatId: string;
      fromMe: boolean;
      body: string;
      photoBase64?: string;
      timestamp: number;
    }) => void,
  ): void {
    const client = this.userIdToClient.get(userId);
    if (!client) return;
    client.on('message_create', (async (msg: { from: string; id?: { fromMe?: boolean }; body?: string; timestamp?: number; hasMedia?: boolean; downloadMedia?: () => Promise<{ data?: string; mimetype?: string } | null>; _data?: { mimetype?: string } }) => {
      let photoBase64: string | undefined;
      try {
        if (msg.hasMedia) {
          const media = await msg.downloadMedia?.();
          const mimetype: string | undefined = media?.mimetype ?? msg?._data?.mimetype;
          if (media?.data && typeof media.data === 'string' && mimetype?.startsWith('image/')) {
            photoBase64 = media.data;
          }
        }
      } catch {
        // ignore download errors; fallback to text only
      }
      handler({
        chatId: msg.from,
        fromMe: msg.id?.fromMe ?? false,
        body: msg.body ?? '',
        photoBase64,
        timestamp: msg.timestamp ?? Date.now() / 1000,
      });
    }) as unknown as (...args: unknown[]) => void);
  }
}
