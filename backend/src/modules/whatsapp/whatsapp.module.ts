import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppController } from './whatsapp.controller';
import { InitializeWhatsAppClientUseCase } from 'src/core/whatsapp/application/use-cases/initialize-client/initialize-client.use-case';
import { UserOrmEntity } from 'src/core/user/infra/repository/typeorm/user.orm-entity';
import { WHATSAPP_SERVICE } from 'src/core/whatsapp/application/interfaces/whatsapp-service.interface';
import { WebjsWhatsAppServiceAdapter } from 'src/core/whatsapp/infra/whatsapp-service/webjs-whatsapp-service.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [WhatsAppController],
  providers: [
    InitializeWhatsAppClientUseCase,
    {
      provide: WHATSAPP_SERVICE,
      useClass: WebjsWhatsAppServiceAdapter,
    },
  ],
  exports: [],
})
export class WhatsAppModule {}
