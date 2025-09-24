import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BRIDGE_REPOSITORY, type BridgeRepositoryInterface } from '../../interfaces/bridge.repository';
import { DeleteBridgeInput } from './delete-bridge.dto';

@Injectable()
export class DeleteBridgeUseCase {
  constructor(
    @Inject(BRIDGE_REPOSITORY)
    private readonly bridgeRepository: BridgeRepositoryInterface,
  ) {}

  async execute(input: DeleteBridgeInput): Promise<void> {
    const found = await this.bridgeRepository.findById(input.bridgeId);
    if (!found) throw new NotFoundException('Bridge not found');
    if (found.userId !== input.userId) throw new ForbiddenException();
    await this.bridgeRepository.delete(input.bridgeId);
  }
}



