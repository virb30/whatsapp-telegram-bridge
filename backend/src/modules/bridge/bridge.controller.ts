import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthenticatedRequest } from '../auth/auth.types';
import { CreateBridgeUseCase } from '../../core/bridge/application/use-cases/create-bridge/create-bridge.use-case';
import { ListBridgesUseCase } from '../../core/bridge/application/use-cases/list-bridges/list-bridges.use-case';
import { DeleteBridgeUseCase } from '../../core/bridge/application/use-cases/delete-bridge/delete-bridge.use-case';
import { CreateBridgeBodyDto } from './dto/create-bridge.dto';

@UseGuards(JwtAuthGuard)
@Controller('bridges')
export class BridgeController {
  constructor(
    private readonly createBridge: CreateBridgeUseCase,
    private readonly listBridges: ListBridgesUseCase,
    private readonly deleteBridge: DeleteBridgeUseCase,
  ) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    const out = await this.listBridges.execute({ userId: req.user.userId });
    return out;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateBridgeBodyDto,
  ) {
    const out = await this.createBridge.execute({
      userId: req.user.userId,
      whatsappGroupId: body.whatsappGroupId,
      telegramGroupId: body.telegramGroupId,
    });
    return out;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.deleteBridge.execute({ userId: req.user.userId, bridgeId: id });
  }
}



