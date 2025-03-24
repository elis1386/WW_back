import { NextFunction, Response } from 'express';
import { WithAuthRequest } from '../types/users';
import { ApiError } from '../errors/ApiError';
import { ROLEVALUES } from '../common/auth';

export function checkAdmin(req: WithAuthRequest, _res: Response, next: NextFunction) {
  const { user } = req;
  if (!user) {
    next(ApiError.forbidden("You don't have access to this resource"));
    return;
  }

  const { role } = user;
  if (role !== ROLEVALUES.ADMIN) {
    next(ApiError.forbidden("You don't have access to this resource"));
    return;
  }

  next();
}
