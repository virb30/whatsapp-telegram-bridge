import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TelegramLoginStateRepositoryInterface,
  TelegramLoginState,
} from '../../../application/interfaces/telegram-login-state.repository';
import { TelegramLoginStateOrmEntity } from './telegram-login-state.orm-entity';

@Injectable()
export class TypeormTelegramLoginStateRepository
  implements TelegramLoginStateRepositoryInterface
{
  constructor(
    @InjectRepository(TelegramLoginStateOrmEntity)
    private readonly repo: Repository<TelegramLoginStateOrmEntity>,
  ) {}

  async getByUserId(userId: string): Promise<TelegramLoginState | null> {
    const row = await this.repo.findOne({ where: { userId } });
    return row
      ? {
          userId: row.userId,
          phoneCodeHash: row.phoneCodeHash,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        }
      : null;
  }

  async upsert(userId: string, phoneCodeHash: string): Promise<void> {
    await this.repo.save({ userId, phoneCodeHash });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repo.delete({ userId });
  }
}


