import { Body, Controller, MessageEvent, Param, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { InitializeTelegramClientUseCase } from '../../core/telegram/application/use-cases/initialize-client/initialize-client.use-case';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TelegramStatus } from '../../core/telegram/application/interfaces/telegram.service';
import { AuthenticatedRequest } from '../auth/auth.types';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignInTelegramUseCase } from '../../core/telegram/application/use-cases/sign-in/sign-in.use-case';

class SignInTelegramInputDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly initializeClient: InitializeTelegramClientUseCase,
    private readonly signInUseCase: SignInTelegramUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Sse('connect/:userId')
  connect(@Param('userId') userId: string) {
    const observable = fromEvent(this.eventEmitter, 'telegram.status').pipe(
      map<unknown, MessageEvent>((args: unknown) => {
        console.log('telegram.status', args);
        const data = args as TelegramStatus;
        return {
          data,
          type: 'telegram.status',
        };
      })
    );
    void this.initializeClient.execute({ userId });
    return observable;
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-password')
  signIn(@Req() req: AuthenticatedRequest, @Body() body: SignInTelegramInputDto) {
    const userId: string = req.user.userId;
    return this.signInUseCase.execute({
      userId,
      sessionId: body.sessionId,
      password: body.password,
    });
  }
}


