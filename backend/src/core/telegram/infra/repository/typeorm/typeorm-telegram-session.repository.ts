import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../../../../user/infra/repository/typeorm/user.orm-entity';
import { type TelegramSessionRepositoryInterface } from '../../../application/interfaces/telegram-session.repository';

@Injectable()
export class TypeormTelegramSessionRepository
  implements TelegramSessionRepositoryInterface
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async getSessionString(userId: string): Promise<string | null> {
    const user = await this.repo.findOne({ where: { id: userId } });
    return user?.telegramSession ?? null;
  }

  async setSessionString(userId: string, session: string | null): Promise<void> {
    await this.repo.update({ id: userId }, { telegramSession: session });
  }
}


