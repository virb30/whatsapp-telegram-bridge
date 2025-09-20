import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../core/user/application/use-cases/authenticate-user/authenticate-user.use-case';

class LoginDto {
  readonly email!: string;
  readonly password!: string;
}

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthenticateUserUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() body: LoginDto) {
    return this.auth.execute(body.email, body.password);
  }
}
