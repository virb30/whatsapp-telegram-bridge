import { Message } from './message.entity';
import { ContactId } from '../value-objects/contact-id.vo';
import { GroupId } from '../value-objects/group-id.vo';

describe('Message Entity', () => {
  it('deve criar uma mensagem válida com body', () => {
    const from = ContactId.create('user-1');
    const to = GroupId.create('group-1');
    const message = new Message({ id: 'msg-1', from, to, body: 'hello' });
    expect(message.id).toBe('msg-1');
    expect(message.from).toBe(from);
    expect(message.to).toBe(to);
    expect(message.body).toBe('hello');
    expect(message.mediaUrl).toBeUndefined();
  });

  it('deve criar uma mensagem válida com mediaUrl', () => {
    const from = GroupId.create('group-1');
    const to = ContactId.create('user-2');
    const message = new Message({ id: 'msg-2', from, to, mediaUrl: 'http://image' });
    expect(message.mediaUrl).toBe('http://image');
  });

  it('deve lançar erro quando id é vazio', () => {
    const from = ContactId.create('user-1');
    const to = ContactId.create('user-2');
    expect(() => new Message({ id: '   ', from, to, body: 'x' })).toThrow('Message id must not be empty');
  });

  it('deve lançar erro quando body e mediaUrl estão ausentes', () => {
    const from = ContactId.create('user-1');
    const to = ContactId.create('user-2');
    expect(() => new Message({ id: 'msg-3', from, to })).toThrow('Message must have at least body or mediaUrl');
  });
});


