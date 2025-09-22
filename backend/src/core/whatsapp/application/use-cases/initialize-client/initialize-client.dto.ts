import { IsString } from 'class-validator';

export class InitializeWhatsAppClientInput {
  @IsString()
  readonly userId!: string;
}

export interface InitializeWhatsAppClientOutput {
  status: 'ready' | 'qr' | 'connecting' | 'error';
  qrCode?: string;
}


