import { GroupId } from './group-id.vo';

describe('GroupId', () => {
  it('deve criar um GroupId válido', () => {
    const id = GroupId.create('group-123');
    expect(id.toString()).toBe('group-123');
  });

  it('deve comparar igualdade corretamente', () => {
    const a = GroupId.create('abc');
    const b = GroupId.create('abc');
    const c = GroupId.create('def');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('deve lançar erro para string vazia', () => {
    expect(() => GroupId.create('')).toThrow('GroupId must be a non-empty string');
  });

  it('deve lançar erro para string somente com espaços', () => {
    expect(() => GroupId.create('   ')).toThrow('GroupId must not be empty');
  });

  it('deve lançar erro para id muito longo', () => {
    const long = 'x'.repeat(129);
    expect(() => GroupId.create(long)).toThrow('GroupId is too long');
  });
});


