import { User } from '../../domain/user.entity';

export interface CreateUserRepositoryParams {
  readonly email: string;
  readonly passwordHash: string;
}

export interface UserRecord {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryInterface {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
