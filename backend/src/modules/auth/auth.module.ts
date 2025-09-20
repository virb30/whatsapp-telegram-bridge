import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthenticateUserUseCase } from 'src/core/user/application/use-cases/authenticate-user/authenticate-user.use-case';
import { USER_REPOSITORY } from 'src/core/user/application/interfaces/user.repository';
import { TypeormUserRepository } from 'src/core/user/infra/repository/typeorm/typeorm-user.repository';
import { BcryptHashService } from 'src/core/user/infra/hash/bcrypt-hash.service';
import { HASH_SERVICE } from 'src/core/user/application/interfaces/hash.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [
    AuthenticateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
    {
      provide: HASH_SERVICE,
      useClass: BcryptHashService,
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
