import { CreateUserInput } from '../../../core/user/application/use-cases/create-user/create-user.dto';

export class CreateUserInputDto extends CreateUserInput {}

export interface CreateUserOutputDto {
  id: string;
  email: string;
}
