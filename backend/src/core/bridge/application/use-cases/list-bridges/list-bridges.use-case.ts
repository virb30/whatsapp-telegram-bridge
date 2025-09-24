import { Inject, Injectable } from '@nestjs/common';
import { BRIDGE_REPOSITORY, type BridgeRepositoryInterface } from '../../interfaces/bridge.repository';
import { ListBridgesInput, ListBridgesOutput } from './list-bridges.dto';

@Injectable()
export class ListBridgesUseCase {
  constructor(
    @Inject(BRIDGE_REPOSITORY)
    private readonly bridgeRepository: BridgeRepositoryInterface,
  ) {}

  async execute(input: ListBridgesInput): Promise<ListBridgesOutput> {
    const bridges = await this.bridgeRepository.findAllByUserId(input.userId);
    return {
      items: bridges.map((b) => ({
        id: b.id,
        whatsappGroupId: b.whatsappGroupId,
        telegramGroupId: b.telegramGroupId,
      })),
    };
  }
}



