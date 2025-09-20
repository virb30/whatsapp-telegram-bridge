import bcrypt from 'bcrypt';
import { HashServiceInterface } from '../../application/interfaces/hash.service';

const SALT_ROUNDS = 10;

export class BcryptHashService implements HashServiceInterface {
  constructor(private readonly saltRounds: number = SALT_ROUNDS) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
