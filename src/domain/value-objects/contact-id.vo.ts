export class ContactId {
  private readonly valueInternal: string;

  private constructor(value: string) {
    this.valueInternal = value;
  }

  public static create(value: string): ContactId {
    ContactId.validate(value);
    return new ContactId(value);
  }

  public toString(): string {
    return this.valueInternal;
  }

  public equals(other: ContactId): boolean {
    return this.valueInternal === other.valueInternal;
  }

  private static validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('ContactId must be a non-empty string');
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error('ContactId must not be empty');
    }
    if (trimmed.length > 128) {
      throw new Error('ContactId is too long');
    }
  }
}


