import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppController } from './whatsapp.controller';
import { InitializeWhatsAppClientUseCase } from 'src/core/whatsapp/application/use-cases/initialize-client/initialize-client.use-case';
import { WHATSAPP_SERVICE } from 'src/core/whatsapp/application/interfaces/whatsapp.service';
import { WhatsAppWebJsService } from 'src/core/whatsapp/infra/whatsapp-webjs/whatsapp-web.service';
import { UpdateUserWhatsAppSessionUseCase } from 'src/core/whatsapp/application/use-cases/update-session/update-session.use-case';
import { USER_REPOSITORY } from 'src/core/user/application/interfaces/user.repository';
import { TypeormUserRepository } from 'src/core/user/infra/repository/typeorm/typeorm-user.repository';
import { WhatsAppSessionOrmEntity } from 'src/core/whatsapp/infra/repository/typeorm/whatsapp-session.orm-entity';
import { TypeormWhatsAppSessionRepository } from 'src/core/whatsapp/infra/repository/typeorm/typeorm-whatsapp-session.repository';
import { UserOrmEntity } from 'src/core/user/infra/repository/typeorm/user.orm-entity';
import { WHATSAPP_EVENTS, WhatsAppEvents } from 'src/core/whatsapp/application/events/whatsapp.events';
import { WHATSAPP_SESSION_REPOSITORY } from 'src/core/whatsapp/application/interfaces/whatsapp-session.repository';
// removed adapter usage; using dedicated repository instead
import { WhatsAppGateway } from 'src/core/whatsapp/application/gateway/whatsapp.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, WhatsAppSessionOrmEntity])],
  controllers: [WhatsAppController],
  providers: [
    InitializeWhatsAppClientUseCase,
    UpdateUserWhatsAppSessionUseCase,
    WhatsAppGateway,
    {
      provide: WHATSAPP_EVENTS,
      useClass: WhatsAppEvents,
    },
    {
      provide: WHATSAPP_SERVICE,
      useClass: WhatsAppWebJsService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
    {
      provide: WHATSAPP_SESSION_REPOSITORY,
      useClass: TypeormWhatsAppSessionRepository,
    },
  ],
})
export class WhatsAppModule {}


