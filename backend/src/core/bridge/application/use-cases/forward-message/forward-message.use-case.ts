import { Inject, Injectable, Logger } from '@nestjs/common';
import { BRIDGE_REPOSITORY } from '../../interfaces/bridge.repository';
import { BridgeRepositoryInterface } from '../../interfaces/bridge.repository';
import { SendMessageToTelegramUseCase } from 'src/core/telegram/application/use-cases/send-message/send-message.use-case';
import { ForwardMessageInput } from './forward-message.dto';

@Injectable()
export class ForwardMessageUseCase {
  private readonly logger = new Logger(ForwardMessageUseCase.name);

  constructor(
    @Inject(BRIDGE_REPOSITORY)
    private readonly bridgeRepository: BridgeRepositoryInterface,
    private readonly sendToTelegram: SendMessageToTelegramUseCase,
  ) {}

  async execute(input: ForwardMessageInput): Promise<boolean> {
    if (!input.fromMe) return false;

    const bridges = await this.bridgeRepository.findAllByUserId(input.userId);
    const bridge = bridges.find((b) => b.whatsappGroupId === input.chatId);
    if (!bridge) return false;

    const hasPhoto = Boolean(input.photoBase64);
    const text = input.body?.trim();
    if (!hasPhoto && !text) return false;

    if (hasPhoto) {
      await this.sendToTelegram.execute({
        userId: input.userId,
        groupId: bridge.telegramGroupId,
        photoBase64: input.photoBase64!,
        caption: text,
      });
      this.logger.debug(`Forwarded photo from ${input.chatId} to ${bridge.telegramGroupId}`);
    } else if (text) {
      await this.sendToTelegram.execute({
        userId: input.userId,
        groupId: bridge.telegramGroupId,
        message: text,
      });
      this.logger.debug(`Forwarded message from ${input.chatId} to ${bridge.telegramGroupId}`);
    }
    return true;
  }
}


