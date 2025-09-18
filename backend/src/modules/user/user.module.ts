import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../../core/user/infra/typeorm/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class UserModule {}
