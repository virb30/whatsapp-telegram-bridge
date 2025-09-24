import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramController } from './telegram.controller';
import { ConnectTelegramUseCase } from 'src/core/telegram/application/use-cases/connect/connect.use-case';
import { SignInTelegramUseCase } from 'src/core/telegram/application/use-cases/sign-in/sign-in.use-case';
import { SendMessageToTelegramUseCase } from 'src/core/telegram/application/use-cases/send-message/send-message.use-case';
import { TELEGRAM_SERVICE } from 'src/core/telegram/application/interfaces/telegram.service';
import { GramJsTelegramService } from 'src/core/telegram/infra/gramjs/telegram.service';
import { TELEGRAM_SESSION_REPOSITORY } from 'src/core/telegram/application/interfaces/telegram-session.repository';
import { TypeormTelegramSessionRepository } from 'src/core/telegram/infra/repository/typeorm/typeorm-telegram-session.repository';
import { UserOrmEntity } from 'src/core/user/infra/repository/typeorm/user.orm-entity';
import { UpdateUserTelegramSessionUseCase } from 'src/core/telegram/application/use-cases/update-session/update-session.use-case';
import { TelegramLoginStateOrmEntity } from 'src/core/telegram/infra/repository/typeorm/telegram-login-state.orm-entity';
import { TELEGRAM_LOGIN_STATE_REPOSITORY } from 'src/core/telegram/application/interfaces/telegram-login-state.repository';
import { TypeormTelegramLoginStateRepository } from 'src/core/telegram/infra/repository/typeorm/typeorm-telegram-login-state.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, TelegramLoginStateOrmEntity])],
  controllers: [TelegramController],
  providers: [
    ConnectTelegramUseCase,
    SignInTelegramUseCase,
    SendMessageToTelegramUseCase,
    UpdateUserTelegramSessionUseCase,
    {
      provide: TELEGRAM_SERVICE,
      useClass: GramJsTelegramService,
    },
    {
      provide: TELEGRAM_SESSION_REPOSITORY,
      useClass: TypeormTelegramSessionRepository,
    },
    {
      provide: TELEGRAM_LOGIN_STATE_REPOSITORY,
      useClass: TypeormTelegramLoginStateRepository,
    },
  ],
})
export class TelegramModule {}


