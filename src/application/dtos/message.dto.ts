export interface MessageDTO {
  id: string;
  from: string; // contact or group id
  to: string;   // contact or group id
  text?: string;
  imageUrl?: string;
  link?: string;
}

export interface MessageDTO {
  from: string;
  text?: string;
  imageUrl?: string;
  link?: string;
}


