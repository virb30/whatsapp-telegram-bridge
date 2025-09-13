export class GroupId {
  private readonly valueInternal: string;

  private constructor(value: string) {
    this.valueInternal = value;
  }

  public static create(value: string): GroupId {
    GroupId.validate(value);
    return new GroupId(value);
  }

  public toString(): string {
    return this.valueInternal;
  }

  public equals(other: GroupId): boolean {
    return this.valueInternal === other.valueInternal;
  }

  private static validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('GroupId must be a non-empty string');
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error('GroupId must not be empty');
    }
    if (trimmed.length > 128) {
      throw new Error('GroupId is too long');
    }
  }
}


