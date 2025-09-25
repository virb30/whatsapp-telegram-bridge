import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BridgeRepositoryInterface } from '../../application/interfaces/bridge.repository';
import { Bridge } from '../../domain/bridge';
import { BridgeOrmEntity } from './bridge.orm-entity';

@Injectable()
export class TypeormBridgeRepository implements BridgeRepositoryInterface {
  constructor(
    @InjectRepository(BridgeOrmEntity)
    private readonly repo: Repository<BridgeOrmEntity>,
  ) {}

  async save(bridge: Bridge): Promise<void> {
    const entity = this.repo.create({
      id: bridge.id,
      userId: bridge.userId,
      whatsappGroupId: bridge.whatsappGroupId,
      telegramGroupId: bridge.telegramGroupId,
      createdAt: bridge.createdAt,
    });
    await this.repo.save(entity);
  }

  async findAllByUserId(userId: string): Promise<Bridge[]> {
    const list = await this.repo.find({ where: { userId } });
    return list.map((e) =>
      new Bridge({
        id: e.id,
        userId: e.userId,
        whatsappGroupId: e.whatsappGroupId,
        telegramGroupId: e.telegramGroupId,
        createdAt: e.createdAt,
      }),
    );
  }

  async findById(id: string): Promise<Bridge | null> {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) return null;
    return new Bridge({
      id: e.id,
      userId: e.userId,
      whatsappGroupId: e.whatsappGroupId,
      telegramGroupId: e.telegramGroupId,
      createdAt: e.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async findAll(): Promise<Bridge[]> {
    const list = await this.repo.find();
    return list.map((e) =>
      new Bridge({
        id: e.id,
        userId: e.userId,
        whatsappGroupId: e.whatsappGroupId,
        telegramGroupId: e.telegramGroupId,
        createdAt: e.createdAt,
      }),
    );
  }
}



