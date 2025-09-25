import { Inject, Injectable } from '@nestjs/common';
import { BRIDGE_REPOSITORY, type BridgeRepositoryInterface } from '../../interfaces/bridge.repository';
import { type Bridge } from '../../../domain/bridge';

@Injectable()
export class ListAllBridgesUseCase {
  constructor(
    @Inject(BRIDGE_REPOSITORY)
    private readonly bridgeRepository: BridgeRepositoryInterface,
  ) {}

  async execute(): Promise<Bridge[]> {
    // Para a saga inicializar listeners de todos usuários
    const out = await this.bridgeRepository.findAll();
    return out;
  }
}


