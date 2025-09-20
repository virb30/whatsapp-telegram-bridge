import { Email } from './email.vo';
import { UserId } from './user-id.vo';

type UserProps = {
  id: UserId;
  email: Email;
  passwordHash: string;
};

export class User {
  readonly id: UserId;
  readonly email: Email;
  readonly passwordHash: string;

  constructor({ id, email, passwordHash }: UserProps) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
  }
}
