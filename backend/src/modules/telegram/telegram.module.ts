import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramController } from './telegram.controller';
import { UserOrmEntity } from '../../core/user/infra/repository/typeorm/user.orm-entity';
import { TelegramLoginStateOrmEntity } from '../../core/telegram/infra/repository/typeorm/telegram-login-state.orm-entity';
import { InitializeTelegramClientUseCase } from '../../core/telegram/application/use-cases/initialize-client/initialize-client.use-case';
import { TELEGRAM_SERVICE } from '../../core/telegram/application/interfaces/telegram-service.interface';
import { GramJsTelegramServiceAdapter } from '../../core/telegram/infra/telegram-service/gramjs.telegram-service.adapter';
import { SignInTelegramUseCase } from '../../core/telegram/application/use-cases/sign-in/sign-in.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, TelegramLoginStateOrmEntity])],
  controllers: [TelegramController],
  providers: [
    InitializeTelegramClientUseCase,
    SignInTelegramUseCase,
    {
      provide: TELEGRAM_SERVICE,
      useClass: GramJsTelegramServiceAdapter,
    }
  ],
  exports: [],
})
export class TelegramModule {}


