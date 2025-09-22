import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { type WhatsAppSessionRepositoryInterface } from '../../../application/interfaces/whatsapp-session.repository';
import { WhatsAppSessionOrmEntity } from './whatsapp-session.orm-entity';

@Injectable()
export class TypeormWhatsAppSessionRepository implements WhatsAppSessionRepositoryInterface {
  constructor(
    @InjectRepository(WhatsAppSessionOrmEntity)
    private readonly repo: Repository<WhatsAppSessionOrmEntity>,
  ) {}

  async getSessionJson(userId: string): Promise<string | null> {
    const row = await this.repo.findOne({ where: { userId } });
    return row?.sessionJson ?? null;
  }

  async setSessionJson(userId: string, sessionJson: string | null): Promise<void> {
    const existing = await this.repo.findOne({ where: { userId } });
    if (!existing) {
      const created = this.repo.create({ userId, sessionJson: sessionJson ?? null });
      await this.repo.save(created);
      return;
    }
    existing.sessionJson = sessionJson ?? null;
    await this.repo.save(existing);
  }
}


