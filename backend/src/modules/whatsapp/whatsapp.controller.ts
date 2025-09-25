import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { InitializeWhatsAppClientUseCase } from 'src/core/whatsapp/application/use-cases/initialize-client/initialize-client.use-case';

@Controller('api/v1/whatsapp')
export class WhatsAppController {
  constructor(
    private readonly initializeClient: InitializeWhatsAppClientUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('qr')
  async getQr(@Req() req: { user: { userId: string } }) {
    const userId: string = req.user.userId;
    const result = await this.initializeClient.execute({ userId });
    return result; // { status, qrCode }
  }
}
