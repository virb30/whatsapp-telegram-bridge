export const WHATSAPP_SERVICE = Symbol('WHATSAPP_SERVICE');

export interface WhatsAppStatus {
  status: 'qr' | 'ready' | 'disconnected' | 'auth_failure';
  qrCode?: string;
}

export interface WhatsAppServiceInterface {
  initializeClient(userId: string): void;
}