import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserInput {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  readonly password!: string;
}

export interface CreateUserOutput {
  id: string;
  email: string;
}
