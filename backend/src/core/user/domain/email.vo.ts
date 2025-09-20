export class Email {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (!this.value.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
