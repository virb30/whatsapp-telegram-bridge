import { WhatsappClient } from './whatsapp.client';
import { MessageDTO } from '../../../application/dtos/message.dto';
import { Client as WaWebClient } from 'whatsapp-web.js';

jest.mock('whatsapp-web.js', () => ({
  Client: jest.fn(),
}));

type MockWaClient = {
  initialize: jest.Mock<Promise<void>, []>;
  on: jest.Mock<void, [string, (message: MockWaMessage) => void]>;
};

type MockWaMessage = {
  id: { _serialized: string };
  from: string;
  to: string;
  body: string;
  fromMe: boolean;
};

describe('WhatsappClient', () => {
  let whatsappClient: WhatsappClient;
  let mockClient: MockWaClient;

  beforeEach(() => {
    mockClient = {
      initialize: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
    };

    const WaClientMock = WaWebClient as unknown as jest.Mock;
    WaClientMock.mockImplementation(() => mockClient as unknown as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('initialize', () => {
    beforeEach(() => {
      whatsappClient = new WhatsappClient();
    });

    it('deve inicializar o cliente subjacente', async () => {
      await whatsappClient.initialize();

      expect(mockClient.initialize).toHaveBeenCalledTimes(1);
    });

    it('deve registrar o handler de message_create', async () => {
      await whatsappClient.initialize();

      expect(mockClient.on).toHaveBeenCalledWith('message_create', expect.any(Function));
    });

    it('deve lançar erro quando a inicialização falha', async () => {
      const error = new Error('Initialization failed');
      mockClient.initialize.mockRejectedValueOnce(error);

      await expect(whatsappClient.initialize()).rejects.toThrow(
        'Whatsapp client initialization failed: Initialization failed'
      );
    });
  });

  describe('onMessage', () => {
    beforeEach(async () => {
      whatsappClient = new WhatsappClient();
      await whatsappClient.initialize();
    });

    it('deve emitir somente mensagens fromMe para o callback mapeadas como MessageDTO', () => {
      const received: MessageDTO[] = [];
      whatsappClient.onMessage((m) => received.push(m));

      // Obter o handler registrado
      const messageCreateCall = mockClient.on.mock.calls.find(call => call[0] === 'message_create');
      expect(messageCreateCall).toBeDefined();

      const messageHandler = messageCreateCall?.[1];
      expect(messageHandler).toBeDefined();

      // Simular mensagem enviada por mim (fromMe)
      const mockMessage: MockWaMessage = {
        id: { _serialized: 'm-1' },
        from: 'me',
        to: 'wa-group-1',
        body: 'hello world',
        fromMe: true,
      };

      if (messageHandler) {
        messageHandler(mockMessage);
      }

      // Simular mensagem recebida de outro usuário (não deve repassar)
      const mockMessageFromOther: MockWaMessage = {
        id: { _serialized: 'm-2' },
        from: 'contact-x',
        to: 'wa-group-1',
        body: 'ignore this',
        fromMe: false,
      };

      if (messageHandler) {
        messageHandler(mockMessageFromOther);
      }

      expect(received).toHaveLength(1);
      expect(received[0]).toEqual({
        id: 'm-1',
        from: 'me',
        to: 'wa-group-1',
        text: 'hello world',
      });
    });

    it('não deve emitir mensagens que não são fromMe', () => {
      const received: MessageDTO[] = [];
      whatsappClient.onMessage((m) => received.push(m));

      // Obter o handler registrado
      const messageCreateCall = mockClient.on.mock.calls.find(call => call[0] === 'message_create');
      expect(messageCreateCall).toBeDefined();

      const messageHandler = messageCreateCall?.[1];
      expect(messageHandler).toBeDefined();

      // Simular mensagem recebida de outro usuário
      const mockMessageFromOther: MockWaMessage = {
        id: { _serialized: 'm-2' },
        from: 'contact-x',
        to: 'wa-group-1',
        body: 'ignore this',
        fromMe: false,
      };

      if (messageHandler) {
        messageHandler(mockMessageFromOther);
      }

      expect(received).toHaveLength(0);
    });
  });
});


