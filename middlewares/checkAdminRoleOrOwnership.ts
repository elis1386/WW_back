import { NextFunction, Response } from 'express';
import { WithAuthRequest } from '../types/users';
import { ROLEVALUES } from '../common/auth';
import { ApiError } from '../errors/ApiError';

export function checkAdminRoleOrOwnership(
  req: WithAuthRequest,
  _res: Response,
  next: NextFunction
) {
  if (req.user === undefined) {
    next(ApiError.resourceNotFound('User not found'));
    return;
  }
  const { role, id } = req.user;
  const isAdmin = role === ROLEVALUES.ADMIN;
  const isOwner = id === req.params.id;
  if (!isAdmin && !isOwner) {
    next(ApiError.forbidden("You don't have access to this resource"));
    return;
  }
  next();
}
