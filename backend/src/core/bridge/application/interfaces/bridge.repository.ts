import { Bridge } from '../../domain/bridge';

export const BRIDGE_REPOSITORY = Symbol('BRIDGE_REPOSITORY');

export interface BridgeRepositoryInterface {
  save(bridge: Bridge): Promise<void>;
  findAllByUserId(userId: string): Promise<Bridge[]>;
  findById(id: string): Promise<Bridge | null>;
  delete(id: string): Promise<void>;
}



