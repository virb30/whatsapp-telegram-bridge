import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ConnectTelegramUseCase } from 'src/core/telegram/application/use-cases/connect/connect.use-case';
import { SignInTelegramUseCase } from 'src/core/telegram/application/use-cases/sign-in/sign-in.use-case';

interface AuthenticatedRequest {
  user: { userId: string };
}

class ConnectTelegramDto {
  phone!: string;
}

class SignInTelegramDto {
  phone!: string;
  code!: string;
  password?: string;
}

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly connectUseCase: ConnectTelegramUseCase,
    private readonly signInUseCase: SignInTelegramUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('connect')
  async connect(@Req() req: AuthenticatedRequest, @Body() body: ConnectTelegramDto) {
    const userId: string = req.user.userId;
    return await this.connectUseCase.execute({ userId, phone: body.phone });
  }

  @UseGuards(JwtAuthGuard)
  @Post('signin')
  async signIn(@Req() req: AuthenticatedRequest, @Body() body: SignInTelegramDto) {
    const userId: string = req.user.userId;
    return await this.signInUseCase.execute({
      userId,
      phone: body.phone,
      code: body.code,
      password: body.password,
    });
  }
}


