import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserOrmEntity } from './core/user/infra/repository/typeorm/user.orm-entity';
import { BridgeOrmEntity } from './core/bridge/infra/typeorm/bridge.orm-entity';
import { UserModule } from './modules/user/user.module';
import { BridgeModule } from './modules/bridge/bridge.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DB_PATH || 'data/dev.sqlite',
      entities: [UserOrmEntity, BridgeOrmEntity],
      synchronize: true,
    }),
    UserModule,
    BridgeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
