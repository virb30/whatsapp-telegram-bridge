import { ContactId } from '../value-objects/contact-id.vo';
import { GroupId } from '../value-objects/group-id.vo';

export type MessageRecipient = ContactId | GroupId;

export interface MessageProps {
  id: string;
  from: MessageRecipient;
  to: MessageRecipient;
  body?: string;
  mediaUrl?: string;
}

export class Message {
  private readonly _id: string;
  private readonly _from: MessageRecipient;
  private readonly _to: MessageRecipient;
  private readonly _body?: string;
  private readonly _mediaUrl?: string;

  constructor(props: MessageProps) {
    Message.assertValidId(props.id);
    Message.assertValidContent(props.body, props.mediaUrl);

    this._id = props.id;
    this._from = props.from;
    this._to = props.to;
    this._body = props.body;
    this._mediaUrl = props.mediaUrl;
  }

  public get id(): string {
    return this._id;
  }

  public get from(): MessageRecipient {
    return this._from;
  }

  public get to(): MessageRecipient {
    return this._to;
  }

  public get body(): string | undefined {
    return this._body;
  }

  public get mediaUrl(): string | undefined {
    return this._mediaUrl;
  }

  private static assertValidId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new Error('Message id must be a non-empty string');
    }
    const trimmed = id.trim();
    if (trimmed.length === 0) {
      throw new Error('Message id must not be empty');
    }
    if (trimmed.length > 128) {
      throw new Error('Message id is too long');
    }
  }

  private static assertValidContent(body?: string, mediaUrl?: string): void {
    if ((!body || body.trim().length === 0) && (!mediaUrl || mediaUrl.trim().length === 0)) {
      throw new Error('Message must have at least body or mediaUrl');
    }
  }
}


