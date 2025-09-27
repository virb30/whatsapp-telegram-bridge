import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../core/user/application/use-cases/create-user/create-user.use-case';
import { CreateUserInputDto } from './dto/create-user.dto';
import { CreateUserOutput } from '../../core/user/application/use-cases/create-user/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserInputDto): Promise<CreateUserOutput> {
    return this.createUserUseCase.execute(body);
  }
}
