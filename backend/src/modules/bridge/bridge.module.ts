import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridgeOrmEntity } from '../../core/bridge/infra/typeorm/bridge.orm-entity';
import { BridgeController } from './bridge.controller';
import { CreateBridgeUseCase } from '../../core/bridge/application/use-cases/create-bridge/create-bridge.use-case';
import { ListBridgesUseCase } from '../../core/bridge/application/use-cases/list-bridges/list-bridges.use-case';
import { ForwardMessageUseCase } from '../../core/bridge/application/use-cases/forward-message/forward-message.use-case';
import { ListAllBridgesUseCase } from '../../core/bridge/application/use-cases/list-all-bridges/list-all-bridges.use-case';
import { DeleteBridgeUseCase } from '../../core/bridge/application/use-cases/delete-bridge/delete-bridge.use-case';
import { BRIDGE_REPOSITORY } from '../../core/bridge/application/interfaces/bridge.repository';
import { TypeormBridgeRepository } from '../../core/bridge/infra/typeorm/typeorm-bridge.repository';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TypeOrmModule.forFeature([BridgeOrmEntity]), TelegramModule],
  providers: [
    CreateBridgeUseCase,
    ListBridgesUseCase,
    DeleteBridgeUseCase,
    ForwardMessageUseCase,
    ListAllBridgesUseCase,
    {
      provide: BRIDGE_REPOSITORY,
      useClass: TypeormBridgeRepository,
    },
  ],
  controllers: [BridgeController],
  exports: [TypeOrmModule, ForwardMessageUseCase, ListAllBridgesUseCase],
})
export class BridgeModule {}
