import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserOrmEntity } from './core/user/infra/repository/typeorm/user.orm-entity';
import { BridgeOrmEntity } from './core/bridge/infra/typeorm/bridge.orm-entity';
import { UserModule } from './modules/user/user.module';
import { BridgeModule } from './modules/bridge/bridge.module';
import { AuthModule } from './modules/auth/auth.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { WhatsAppSessionOrmEntity } from './core/whatsapp/infra/repository/typeorm/whatsapp-session.orm-entity';
import { TelegramLoginStateOrmEntity } from './core/telegram/infra/repository/typeorm/telegram-login-state.orm-entity';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ForwardingModule } from './modules/forwarding/forwarding.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DB_PATH || 'data/dev.sqlite',
      entities: [
        UserOrmEntity,
        BridgeOrmEntity,
        WhatsAppSessionOrmEntity,
        TelegramLoginStateOrmEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    BridgeModule,
    AuthModule,
    WhatsAppModule,
    TelegramModule,
    ForwardingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
