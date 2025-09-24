import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridgeOrmEntity } from '../../core/bridge/infra/typeorm/bridge.orm-entity';
import { BridgeController } from './bridge.controller';
import { CreateBridgeUseCase } from '../../core/bridge/application/use-cases/create-bridge/create-bridge.use-case';
import { ListBridgesUseCase } from '../../core/bridge/application/use-cases/list-bridges/list-bridges.use-case';
import { DeleteBridgeUseCase } from '../../core/bridge/application/use-cases/delete-bridge/delete-bridge.use-case';
import { BRIDGE_REPOSITORY } from '../../core/bridge/application/interfaces/bridge.repository';
import { TypeormBridgeRepository } from '../../core/bridge/infra/typeorm/typeorm-bridge.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BridgeOrmEntity])],
  providers: [
    CreateBridgeUseCase,
    ListBridgesUseCase,
    DeleteBridgeUseCase,
    {
      provide: BRIDGE_REPOSITORY,
      useClass: TypeormBridgeRepository,
    },
  ],
  controllers: [BridgeController],
  exports: [TypeOrmModule],
})
export class BridgeModule {}
