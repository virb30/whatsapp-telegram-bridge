import { v7 as uuidv7, validate as uuidValidate } from 'uuid';

export class UserId {
  readonly value: string;

  constructor(value?: string) {
    this.value = value || uuidv7();
    this.validate();
  }

  validate() {
    if (!uuidValidate(this.value)) throw new Error('Invalid user id');
  }
}
