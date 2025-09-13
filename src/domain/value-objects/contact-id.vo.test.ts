import { ContactId } from './contact-id.vo';

describe('ContactId', () => {
  it('deve criar um ContactId válido', () => {
    const id = ContactId.create('contact-123');
    expect(id.toString()).toBe('contact-123');
  });

  it('deve comparar igualdade corretamente', () => {
    const a = ContactId.create('abc');
    const b = ContactId.create('abc');
    const c = ContactId.create('def');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('deve lançar erro para string vazia', () => {
    expect(() => ContactId.create('')).toThrow('ContactId must be a non-empty string');
  });

  it('deve lançar erro para string somente com espaços', () => {
    expect(() => ContactId.create('   ')).toThrow('ContactId must not be empty');
  });

  it('deve lançar erro para id muito longo', () => {
    const long = 'x'.repeat(129);
    expect(() => ContactId.create(long)).toThrow('ContactId is too long');
  });
});


