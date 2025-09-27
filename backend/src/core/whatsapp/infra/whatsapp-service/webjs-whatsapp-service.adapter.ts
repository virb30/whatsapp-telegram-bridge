import { WhatsAppServiceInterface } from "../../application/interfaces/whatsapp-service.interface";


export class WebjsWhatsAppServiceAdapter implements WhatsAppServiceInterface {
  
  constructor() { }

  async getQrCode(): Promise<string> {
    return 'ok';
  }
}