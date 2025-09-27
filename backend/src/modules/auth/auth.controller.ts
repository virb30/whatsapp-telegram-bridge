import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../core/user/application/use-cases/authenticate-user/authenticate-user.use-case';
import { JwtAuthGuard } from './jwt.guard';

class LoginDto {
  readonly email!: string;
  readonly password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthenticateUserUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() body: LoginDto) {
    return this.auth.execute(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { userId: string; email: string } }) {
    // expõe id e email autenticados a partir do payload do JWT
    return { id: req.user.userId, email: req.user.email };
  }
}
