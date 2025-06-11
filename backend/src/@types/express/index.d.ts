import { User } from 'src/app/users/schemas/user.schema';

declare module 'express' {
  export interface Request {
    user: User;
  }
}
