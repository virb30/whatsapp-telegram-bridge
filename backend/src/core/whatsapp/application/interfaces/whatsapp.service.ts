export const WHATSAPP_SERVICE = Symbol('WHATSAPP_SERVICE');

export interface InitializeClientParams {
  readonly userId: string;
  readonly sessionJson?: string | null;
}

export interface InitializeClientResult {
  readonly qrCode?: string; // Base64 PNG data URL
  readonly status: 'ready' | 'qr' | 'connecting' | 'error';
}

export interface WhatsAppServiceInterface {
  initializeClient(
    params: InitializeClientParams,
  ): Promise<InitializeClientResult>;
  onMessage(
    userId: string,
    handler: (payload: {
      chatId: string;
      fromMe: boolean;
      body: string;
      photoBase64?: string;
      timestamp: number;
    }) => void,
  ): void;
}
