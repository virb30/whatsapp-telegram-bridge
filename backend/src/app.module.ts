import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserOrmEntity } from './core/user/infra/repository/typeorm/user.orm-entity';
import { BridgeOrmEntity } from './core/bridge/infra/typeorm/bridge.orm-entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { WhatsAppSessionOrmEntity } from './core/whatsapp/infra/repository/typeorm/whatsapp-session.orm-entity';
import { TelegramLoginStateOrmEntity } from './core/telegram/infra/repository/typeorm/telegram-login-state.orm-entity';
import { TelegramModule } from './modules/telegram/telegram.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    AuthModule,
    WhatsAppModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
