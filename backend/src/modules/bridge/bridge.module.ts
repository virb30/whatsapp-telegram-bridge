import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridgeOrmEntity } from '../../core/bridge/infra/typeorm/bridge.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([BridgeOrmEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class BridgeModule {}
