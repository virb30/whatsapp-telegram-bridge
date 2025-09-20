import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateUserInput {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}

export class AuthenticateUserOutput {
  readonly access_token!: string;
}
