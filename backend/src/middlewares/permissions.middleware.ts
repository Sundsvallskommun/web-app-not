import { HttpException } from '@exceptions/HttpException';
import { NextFunction, Response } from 'express';

import { Permissions, RequestWithUser } from '@/interfaces/auth.interface';

/** Lets the request through only when the session user has every one of the given permissions, otherwise 403. */
export const hasPermissions =
  (requiredPermissions: (keyof Permissions)[]) =>
  (req: RequestWithUser, _res: Response, next: NextFunction): void => {
    const userPermissions: Partial<Permissions> = req.user.permissions;
    if (requiredPermissions.every(permission => userPermissions[permission])) {
      next();
      return;
    }
    next(new HttpException(403, 'Missing permissions'));
  };
