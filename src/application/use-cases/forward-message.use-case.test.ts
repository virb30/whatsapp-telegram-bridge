import { ForwardMessageUseCase } from './forward-message.use-case';
import { IMessageRepository } from '../interfaces/message-repository.interface';
import { ITelegramClient } from '../interfaces/telegram-client.interface';
import { IGroupMappingService } from '../interfaces/group-mapping.interface';
import { ForwardMessageInputDTO } from '../dtos/forward-message.dto';
import { Message as DomainMessage } from '../../domain/entities/message.entity';

describe('ForwardMessageUseCase', () => {
  const makeSut = () => {
    const repository: jest.Mocked<IMessageRepository> = {
      save: jest.fn<Promise<void>, [DomainMessage]>().mockResolvedValue(undefined),
      findById: jest
        .fn<Promise<DomainMessage | null>, [string]>()
        .mockResolvedValue(null),
    };
    const telegramClient: jest.Mocked<ITelegramClient> = {
      initialize: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
      sendMessage: jest
        .fn<Promise<void>, [string | number, DomainMessage]>()
        .mockResolvedValue(undefined),
      sendText: jest
        .fn<Promise<void>, [string | number, string]>()
        .mockResolvedValue(undefined),
      // Cast to match optional third argument signature precisely
      sendImage: (jest.fn() as unknown) as ITelegramClient['sendImage'],
    } as unknown as jest.Mocked<ITelegramClient>;
    const mappingService: jest.Mocked<IGroupMappingService> = {
      resolveTelegramChatId: jest
        .fn<Promise<string | number | null>, [string]>()
        .mockResolvedValue(12345),
    };

    const sut = new ForwardMessageUseCase({ repository, telegramClient, mappingService });
    return { sut, repository, telegramClient, mappingService };
  };

  it('deve encaminhar mensagem de texto e salvar no repositório', async () => {
    const { sut, repository, telegramClient, mappingService } = makeSut();
    const input: ForwardMessageInputDTO = {
      message: { id: 'm1', from: 'wa-group-1', to: 'wa-group-1', text: 'hello' },
    };

    const output = await sut.execute(input);

    expect(mappingService.resolveTelegramChatId).toHaveBeenCalledWith('wa-group-1');
    expect(telegramClient.sendMessage).toHaveBeenCalled();
    const callArgs = (telegramClient.sendMessage as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBe(12345);
    const domainMessage = callArgs[1];
    expect(domainMessage.id).toBe('m1');
    expect(domainMessage.body).toBe('hello');
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(output).toEqual({ delivered: true, targetChatId: 12345 });
  });

  it('deve retornar erro quando não há mapeamento de destino', async () => {
    const { sut, mappingService, telegramClient, repository } = makeSut();
    mappingService.resolveTelegramChatId.mockResolvedValueOnce(null);

    const input: ForwardMessageInputDTO = {
      message: { id: 'm2', from: 'wa-group-2', to: 'wa-group-2', text: 'x' },
    };

    const output = await sut.execute(input);

    expect(telegramClient.sendMessage).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(output.delivered).toBe(false);
    expect(output.errorMessage).toBe('No target chat mapping found');
  });
});


