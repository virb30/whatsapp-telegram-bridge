import { MessageForwardingSaga } from '../src/modules/forwarding/message-forwarding.saga';
// Types are local to test to avoid jest/babel parser issues with type-only imports
type ListAllBridgesUseCase = { execute: () => Promise<Array<{ id: string; userId: string; whatsappGroupId: string; telegramGroupId: string; createdAt: Date }>> };
type ForwardMessageUseCase = { execute: (payload: unknown) => Promise<boolean> };
type WhatsAppGateway = { attachListeners: (userId: string) => void };
type WhatsAppEventsInterface = { emitIncomingMessage: (m: unknown) => void; onIncomingMessage: (cb: (m: { userId: string; chatId: string; fromMe: boolean; body: string; photoBase64?: string; timestamp: number }) => void) => void };

describe('MessageForwardingSaga', () => {
  it('anexa listeners por usuário e processa mensagens', async () => {
    const bridges = [
      { id: 'b1', userId: 'u1', whatsappGroupId: 'wa:g1', telegramGroupId: 'tg:g1', createdAt: new Date() },
      { id: 'b2', userId: 'u2', whatsappGroupId: 'wa:g2', telegramGroupId: 'tg:g2', createdAt: new Date() },
    ];

    const listAll = { execute: jest.fn().mockResolvedValue(bridges) } as unknown as ListAllBridgesUseCase;
    const forward = { execute: jest.fn().mockResolvedValue(true) } as unknown as ForwardMessageUseCase;
    const gw = { attachListeners: jest.fn() } as unknown as WhatsAppGateway;
    let handler: ((m: { userId: string; chatId: string; fromMe: boolean; body: string; photoBase64?: string; timestamp: number }) => void) | undefined;
    const events = {
      emitIncomingMessage: jest.fn(),
      onIncomingMessage: jest.fn((cb) => { handler = cb; }),
    } as unknown as WhatsAppEventsInterface;

    const saga = new MessageForwardingSaga(listAll as any, forward as any, gw as any, events as any);
    await saga.onModuleInit();

    expect(gw.attachListeners).toHaveBeenCalledTimes(2);
    expect(gw.attachListeners).toHaveBeenCalledWith('u1');
    expect(gw.attachListeners).toHaveBeenCalledWith('u2');

    expect(handler).toBeDefined();
    handler!({ userId: 'u1', chatId: 'wa:g1', fromMe: true, body: 'ok', timestamp: Date.now() });
    expect(forward.execute).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', chatId: 'wa:g1' }));
  });

  it('propaga photoBase64 quando presente', async () => {
    const bridges = [
      { id: 'b1', userId: 'u1', whatsappGroupId: 'wa:g1', telegramGroupId: 'tg:g1', createdAt: new Date() },
    ];

    const listAll = { execute: jest.fn().mockResolvedValue(bridges) } as unknown as ListAllBridgesUseCase;
    const forward = { execute: jest.fn().mockResolvedValue(true) } as unknown as ForwardMessageUseCase;
    const gw = { attachListeners: jest.fn() } as unknown as WhatsAppGateway;
    let handler: ((m: { userId: string; chatId: string; fromMe: boolean; body: string; photoBase64?: string; timestamp: number }) => void) | undefined;
    const events = {
      emitIncomingMessage: jest.fn(),
      onIncomingMessage: jest.fn((cb) => { handler = cb; }),
    } as unknown as WhatsAppEventsInterface;

    const saga = new MessageForwardingSaga(listAll as any, forward as any, gw as any, events as any);
    await saga.onModuleInit();

    handler!({ userId: 'u1', chatId: 'wa:g1', fromMe: true, body: 'caption', photoBase64: 'ZmFrZUJhc2U2NA==', timestamp: Date.now() });
    expect(forward.execute).toHaveBeenCalledWith(expect.objectContaining({ photoBase64: 'ZmFrZUJhc2U2NA==' }));
  });
});


