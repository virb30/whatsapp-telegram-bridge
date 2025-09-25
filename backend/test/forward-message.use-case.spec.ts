import { ForwardMessageUseCase } from '../src/core/bridge/application/use-cases/forward-message/forward-message.use-case';
import { SendMessageToTelegramUseCase } from '../src/core/telegram/application/use-cases/send-message/send-message.use-case';
import { Bridge } from '../src/core/bridge/domain/bridge';

class InMemoryBridgeRepo {
  items: Bridge[];
  constructor(items: Bridge[]) { this.items = items; }
  async save(): Promise<void> { /* noop */ }
  async findAllByUserId(userId: string): Promise<Bridge[]> {
    return this.items.filter((b) => b.userId === userId);
  }
  async findById(): Promise<Bridge | null> { return null; }
  async delete(): Promise<void> { /* noop */ }
  async findAll(): Promise<Bridge[]> { return this.items; }
}

class FakeSendMessage extends SendMessageToTelegramUseCase {
  constructor() {
    // @ts-expect-error ignore deps
    super(undefined);
  }
  public sent: Array<{ userId: string; groupId: string; message?: string; photoBase64?: string; caption?: string }> = [];
  async execute(input: { userId: string; groupId: string; message?: string; photoBase64?: string; caption?: string }): Promise<void> {
    this.sent.push(input);
  }
}

describe('ForwardMessageUseCase', () => {
  const bridge = new Bridge({
    id: 'b1',
    userId: 'u1',
    whatsappGroupId: 'wa:g1',
    telegramGroupId: 'tg:g1',
    createdAt: new Date(),
  });

  it('não encaminha quando fromMe = false', async () => {
    const repo = new InMemoryBridgeRepo([bridge]);
    const sender = new FakeSendMessage();
    const usecase = new ForwardMessageUseCase(repo, sender);
    const ok = await usecase.execute({ userId: 'u1', chatId: 'wa:g1', fromMe: false, body: 'hi', timestamp: Date.now() });
    expect(ok).toBe(false);
    expect(sender.sent).toHaveLength(0);
  });

  it('não encaminha quando chat não está mapeado', async () => {
    const repo = new InMemoryBridgeRepo([bridge]);
    const sender = new FakeSendMessage();
    const usecase = new ForwardMessageUseCase(repo, sender);
    const ok = await usecase.execute({ userId: 'u1', chatId: 'wa:other', fromMe: true, body: 'hi', timestamp: Date.now() });
    expect(ok).toBe(false);
    expect(sender.sent).toHaveLength(0);
  });

  it('encaminha quando fromMe = true e chat mapeado', async () => {
    const repo = new InMemoryBridgeRepo([bridge]);
    const sender = new FakeSendMessage();
    const usecase = new ForwardMessageUseCase(repo, sender);
    const ok = await usecase.execute({ userId: 'u1', chatId: 'wa:g1', fromMe: true, body: 'hello', timestamp: Date.now() });
    expect(ok).toBe(true);
    expect(sender.sent).toEqual([{ userId: 'u1', groupId: 'tg:g1', message: 'hello' }]);
  });

  it('encaminha imagem quando photoBase64 presente', async () => {
    const repo = new InMemoryBridgeRepo([bridge]);
    const sender = new FakeSendMessage();
    const usecase = new ForwardMessageUseCase(repo, sender);
    const ok = await usecase.execute({ userId: 'u1', chatId: 'wa:g1', fromMe: true, body: 'caption', photoBase64: 'ZmFrZUJhc2U2NA==', timestamp: Date.now() });
    expect(ok).toBe(true);
    expect(sender.sent).toEqual([{ userId: 'u1', groupId: 'tg:g1', photoBase64: 'ZmFrZUJhc2U2NA==', caption: 'caption' }]);
  });
});


