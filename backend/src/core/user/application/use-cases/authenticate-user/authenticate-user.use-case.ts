import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepositoryInterface,
} from '../../interfaces/user.repository';
import {
  HASH_SERVICE,
  type HashServiceInterface,
} from '../../interfaces/hash.service';
import { InvalidCredentialsError } from '../../errors/invalid-crentials.error';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(HASH_SERVICE) private readonly hashService: HashServiceInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashService.verify(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
