export const HASH_SERVICE = Symbol('HASH_SERVICE');

export interface HashServiceInterface {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
