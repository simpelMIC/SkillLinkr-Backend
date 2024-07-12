import { User } from 'database/prisma/generated/prisma-client-js';

declare global {
  namespace Express {
    export interface Request {
      user: Omit<User, 'password'> | undefined;
    }
  }
}
