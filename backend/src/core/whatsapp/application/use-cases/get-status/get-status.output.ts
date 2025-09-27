export interface GetStatusOutput {
  status: 'ready' | 'qr' | 'connecting' | 'error';
  qrCode?: string;
}