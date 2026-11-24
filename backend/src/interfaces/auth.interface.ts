import { User } from '@interfaces/users.interface';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}

/** Permission flags resolved from the user's AD groups at login and carried in the session. */
export interface Permissions {
  canEditSupportManagement: boolean;
}
