import { TelegramClient } from './telegram-client';
import { Message } from '../../../domain/entities/message.entity';
import { ContactId } from '../../../domain/value-objects/contact-id.vo';
import { GroupId } from '../../../domain/value-objects/group-id.vo';
import { Telegraf } from 'telegraf';

jest.mock('telegraf', () => ({ Telegraf: jest.fn() }));

type MockBot = {
  launch: jest.Mock<Promise<void>, []>;
  stop: jest.Mock<Promise<void>, []>;
  telegram: {
    sendMessage: jest.Mock<Promise<{ message_id: number }>, [string, string]>;
    sendPhoto: jest.Mock<Promise<{ message_id: number }>, [string, string, { caption?: string }]>;
  };
};

describe('TelegramClient', () => {
  let telegramClient: TelegramClient;
  let mockBot: MockBot;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };

    process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';

    mockBot = {
      launch: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      telegram: {
        sendMessage: jest.fn(),
        sendPhoto: jest.fn(),
      },
    };

    const TelegrafMock = Telegraf as unknown as jest.Mock;
    TelegrafMock.mockImplementation(() => mockBot as any);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when TELEGRAM_BOT_TOKEN is not set', () => {
      delete process.env.TELEGRAM_BOT_TOKEN;

      expect(() => new TelegramClient()).toThrow(
        'TELEGRAM_BOT_TOKEN environment variable is not set'
      );
    });

    it('should initialize with valid token', () => {
      expect(() => new TelegramClient()).not.toThrow();
    });
  });

  describe('initialize', () => {
    beforeEach(() => {
      telegramClient = new TelegramClient();
    });

    it('should initialize bot successfully', async () => {

      await telegramClient.initialize();

      expect(mockBot.launch).toHaveBeenCalledTimes(1);
    });

    it('should throw error when bot launch fails', async () => {
      const error = new Error('Launch failed');
      mockBot.launch.mockRejectedValueOnce(error);

      await expect(telegramClient.initialize()).rejects.toThrow(
        'Telegram client initialization failed'
      );
    });
  });

  describe('sendMessage', () => {
    beforeEach(async () => {
      telegramClient = new TelegramClient();
      await telegramClient.initialize();
    });

    it('should throw error when client is not initialized', async () => {
      const uninitializedClient = new TelegramClient();
      const message = new Message({ id: 'm-1', from: ContactId.create('test'), to: GroupId.create('g-1'), body: 'Hello' });

      await expect(uninitializedClient.sendMessage('123', message)).rejects.toThrow(
        'Telegram client not initialized'
      );
    });

    it('should send text message successfully', async () => {
      const message = new Message({ id: 'm-2', from: ContactId.create('test'), to: GroupId.create('g-1'), body: 'Hello World' });
      mockBot.telegram.sendMessage.mockResolvedValue({ message_id: 1 });

      await telegramClient.sendMessage('123', message);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith('123', 'Hello World');
    });

    it('should send image message successfully', async () => {
      const message = new Message({ id: 'm-3', from: ContactId.create('test'), to: GroupId.create('g-1'), mediaUrl: 'http://example.com/image.jpg' });
      mockBot.telegram.sendPhoto.mockResolvedValue({ message_id: 1 });

      await telegramClient.sendMessage('123', message);

      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith('123', 'http://example.com/image.jpg', { caption: undefined });
    });

    it('should send both text and image with text as caption', async () => {
      const message = new Message({ id: 'm-4', from: ContactId.create('test'), to: GroupId.create('g-1'), body: 'Check this out', mediaUrl: 'http://example.com/image.jpg' });
      mockBot.telegram.sendMessage.mockResolvedValue({ message_id: 1 });
      mockBot.telegram.sendPhoto.mockResolvedValue({ message_id: 2 });

      await telegramClient.sendMessage('123', message);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith('123', 'Check this out');
      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith('123', 'http://example.com/image.jpg', { caption: 'Check this out' });
    });

    it('should send link (as text body) successfully', async () => {
      const message = new Message({ id: 'm-5', from: ContactId.create('test'), to: GroupId.create('g-1'), body: 'http://example.com' });
      mockBot.telegram.sendMessage.mockResolvedValue({ message_id: 1 });

      await telegramClient.sendMessage('123', message);

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith('123', 'http://example.com');
    });

    it('should handle API errors gracefully', async () => {
      const message = new Message({ id: 'm-6', from: ContactId.create('test'), to: GroupId.create('g-1'), body: 'Hello' });
      const apiError = new Error('API Error');
      (apiError as any).code = 401;

      mockBot.telegram.sendMessage.mockRejectedValue(apiError);

      await expect(telegramClient.sendMessage('123', message)).rejects.toThrow(
        'Invalid Telegram bot token'
      );
    });
  });

  describe('sendText', () => {
    beforeEach(async () => {
      telegramClient = new TelegramClient();
      await telegramClient.initialize();
    });

    it('should send text message successfully', async () => {
      mockBot.telegram.sendMessage.mockResolvedValue({ message_id: 1 });

      await telegramClient.sendText('123', 'Hello World');

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith('123', 'Hello World');
    });

    it('should throw error when client is not initialized', async () => {
      const uninitializedClient = new TelegramClient();

      await expect(uninitializedClient.sendText('123', 'Hello')).rejects.toThrow(
        'Telegram client not initialized'
      );
    });
  });

  describe('sendImage', () => {
    beforeEach(async () => {
      telegramClient = new TelegramClient();
      await telegramClient.initialize();
    });

    it('should send image successfully', async () => {
      mockBot.telegram.sendPhoto.mockResolvedValue({ message_id: 1 });

      await telegramClient.sendImage('123', 'http://example.com/image.jpg', 'Caption');

      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith('123', 'http://example.com/image.jpg', { caption: 'Caption' });
    });

    it('should send image without caption', async () => {
      mockBot.telegram.sendPhoto.mockResolvedValue({ message_id: 1 });

      await telegramClient.sendImage('123', 'http://example.com/image.jpg');

      expect(mockBot.telegram.sendPhoto).toHaveBeenCalledWith('123', 'http://example.com/image.jpg', { caption: undefined });
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      telegramClient = new TelegramClient();
      await telegramClient.initialize();
    });

    it('should handle invalid token error (401)', async () => {
      const error = new Error('Unauthorized');
      (error as any).code = 401;

      mockBot.telegram.sendMessage.mockRejectedValue(error);

      await expect(telegramClient.sendText('123', 'test')).rejects.toThrow(
        'Invalid Telegram bot token'
      );
    });

    it('should handle forbidden error (403)', async () => {
      const error = new Error('Forbidden');
      (error as any).code = 403;

      mockBot.telegram.sendMessage.mockRejectedValue(error);

      await expect(telegramClient.sendText('123', 'test')).rejects.toThrow(
        'Bot is not authorized to send messages to this chat'
      );
    });

    it('should handle rate limit error (429)', async () => {
      const error = new Error('Too Many Requests');
      (error as any).code = 429;

      mockBot.telegram.sendMessage.mockRejectedValue(error);

      await expect(telegramClient.sendText('123', 'test')).rejects.toThrow(
        'Too many requests. Rate limit exceeded'
      );
    });

    it('should handle bad request error (400)', async () => {
      const error = new Error('Bad Request');
      (error as any).response = { statusCode: 400 };

      mockBot.telegram.sendMessage.mockRejectedValue(error);

      await expect(telegramClient.sendText('123', 'test')).rejects.toThrow(
        'Invalid request parameters'
      );
    });

    it('should handle unknown errors', async () => {
      const error = new Error('Unknown error');

      mockBot.telegram.sendMessage.mockRejectedValue(error);

      await expect(telegramClient.sendText('123', 'test')).rejects.toThrow(
        'Unknown error'
      );
    });
  });

  describe('stop', () => {
    it('should stop bot when initialized', async () => {
      telegramClient = new TelegramClient();
      await telegramClient.initialize();

      await telegramClient.stop();

      expect(mockBot.stop).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when stopping uninitialized client', async () => {
      telegramClient = new TelegramClient();

      await expect(telegramClient.stop()).resolves.not.toThrow();
    });
  });
});
