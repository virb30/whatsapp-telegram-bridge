import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email?: string;
    username?: string;
  };
}


