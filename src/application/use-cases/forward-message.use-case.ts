import { ForwardMessageInputDTO, ForwardMessageOutputDTO } from '../dtos/forward-message.dto';
import { IMessageRepository } from '../interfaces/message-repository.interface';
import { ITelegramClient } from '../interfaces/telegram-client.interface';
import { IGroupMappingService } from '../interfaces/group-mapping.interface';
import { Message } from '../../domain/entities/message.entity';
import { ContactId } from '../../domain/value-objects/contact-id.vo';
import { GroupId } from '../../domain/value-objects/group-id.vo';
import { MessageDTO } from '../dtos/message.dto';

export class ForwardMessageUseCase {
  private readonly repository: IMessageRepository;
  private readonly telegramClient: ITelegramClient;
  private readonly mappingService: IGroupMappingService;

  constructor(
    dependencies: {
      repository: IMessageRepository;
      telegramClient: ITelegramClient;
      mappingService: IGroupMappingService;
    }
  ) {
    this.repository = dependencies.repository;
    this.telegramClient = dependencies.telegramClient;
    this.mappingService = dependencies.mappingService;
  }

  public async execute(input: ForwardMessageInputDTO): Promise<ForwardMessageOutputDTO> {
    const { message } = input;

    const targetChatId = await this.mappingService.resolveTelegramChatId(message.to);
    if (!targetChatId) {
      return { delivered: false, errorMessage: 'No target chat mapping found' };
    }

    const domainMessage = new Message({
      id: message.id,
      from: ContactId.create(message.from),
      to: GroupId.create(message.to),
      body: message.text,
      mediaUrl: message.imageUrl ?? message.link,
    });

    await this.telegramClient.sendMessage(targetChatId, domainMessage);
    await this.repository.save(domainMessage);

    return { delivered: true, targetChatId };
  }
}


