import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { type UserRepositoryInterface } from '../../../application/interfaces/user.repository';
import { User } from '../../../domain/user.entity';
import { UserId } from '../../../domain/user-id.vo';
import { Email } from '../../../domain/email.vo';

@Injectable()
export class TypeormUserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const entity = this.repo.create({
      id: user.id.value,
      email: user.email.value,
      passwordHash: user.passwordHash,
    });
    await this.repo.save(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });
    console.log('email', email);
    console.log('found', found);
    if (!found) return null;
    const user = new User({
      id: new UserId(found.id),
      email: new Email(found.email),
      passwordHash: found.passwordHash,
    });
    return user;
  }
}
