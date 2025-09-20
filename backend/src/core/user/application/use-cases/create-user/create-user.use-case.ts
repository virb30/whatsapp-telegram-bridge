import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './create-user.dto';
import {
  type UserRepositoryInterface,
  USER_REPOSITORY,
} from '../../interfaces/user.repository';

import {
  HASH_SERVICE,
  type HashServiceInterface,
} from '../../interfaces/hash.service';
import { Email } from '../../../domain/email.vo';
import { User } from '../../../domain/user.entity';
import { UserId } from '../../../domain/user-id.vo';
import { EmailAlreadyRegisteredError } from '../../errors/email-already-registered.error';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashServiceInterface,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) throw new EmailAlreadyRegisteredError();

    const passwordHash = await this.hashService.hash(input.password);

    const user = new User({
      id: new UserId(),
      email: new Email(input.email),
      passwordHash,
    });

    await this.userRepository.save(user);
    return { id: user.id.value, email: user.email.value };
  }
}
