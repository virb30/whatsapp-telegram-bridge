import { Inject, Injectable } from '@nestjs/common';
import { BRIDGE_REPOSITORY, type BridgeRepositoryInterface } from '../../interfaces/bridge.repository';
import { CreateBridgeInput, CreateBridgeOutput } from './create-bridge.dto';
import { Bridge } from '../../../domain/bridge';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateBridgeUseCase {
  constructor(
    @Inject(BRIDGE_REPOSITORY)
    private readonly bridgeRepository: BridgeRepositoryInterface,
  ) {}

  async execute(input: CreateBridgeInput): Promise<CreateBridgeOutput> {
    const bridge = new Bridge({
      id: randomUUID(),
      userId: input.userId,
      whatsappGroupId: input.whatsappGroupId,
      telegramGroupId: input.telegramGroupId,
      createdAt: new Date(),
    });

    await this.bridgeRepository.save(bridge);
    return { id: bridge.id };
  }
}


