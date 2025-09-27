export interface WhatsAppServiceInterface {
  getQrCode(): Promise<string>;
}