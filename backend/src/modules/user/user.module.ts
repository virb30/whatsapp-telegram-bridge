import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../../core/user/infra/repository/typeorm/user.orm-entity';
import { UserController } from './user.controller';
import { USER_REPOSITORY } from '../../core/user/application/interfaces/user.repository';
import { TypeormUserRepository } from '../../core/user/infra/repository/typeorm/typeorm-user.repository';
import { CreateUserUseCase } from '../../core/user/application/use-cases/create-user/create-user.use-case';
import { BcryptHashService } from '../../core/user/infra/hash/bcrypt-hash.service';
import { HASH_SERVICE } from '../../core/user/application/interfaces/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
    {
      provide: HASH_SERVICE,
      useClass: BcryptHashService,
    },
  ],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}
