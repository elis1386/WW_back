import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadType, WithAuthRequest } from '../types/users';
import UserModel from '../models/User';
import { ApiError } from '../errors/ApiError';

export async function checkAuth(req: WithAuthRequest, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    next(ApiError.forbidden('Token is missing'));
    return;
  }
  try {
    const { userId } = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayloadType;
    const findUser = await UserModel.findById(userId);

    if (!findUser) {
      next(ApiError.forbidden('Invalid token.'));
      return;
    }

    req.user = findUser;
    next();
  } catch (error) {
    next(error);
  }
}
