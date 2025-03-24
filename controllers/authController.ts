import { Request, Response } from 'express';
import { LoginCredentialsType } from '../types/auth';
import AuthService from '../services/authService';
import { UserDto, UserType, WithAuthRequest } from '../types/users';
import statusLogger from '../utils/statusLogger';
import respondWith from '../utils/respondWith';
import { hideSensitiveData } from '../utils/hideSensitiveData';

async function login(req: Request<unknown, unknown, LoginCredentialsType>, res: Response) {
  const credentials = req.body;
  const { accessToken } = await AuthService.login(credentials);
  respondWith(res, { code: 200, data: { accessToken } });
}

async function signup(req: Request<unknown, unknown, UserDto>, res: Response) {
  const userDto = req.body;
  const { accessToken, user } = await AuthService.signup(userDto);
  statusLogger.created('users', user.id);
  respondWith(res, { code: 201, data: { accessToken } });
}

async function me(req: WithAuthRequest, res: Response) {
  const user = await AuthService.me(req.user as UserType);
  respondWith(res, { code: 200, data: hideSensitiveData(user) });
}

async function changePassword(req: WithAuthRequest, res: Response) {
  const passwords = req.body;
  const user = req.user as UserType;
  await AuthService.changePassword(user.id, passwords);
  respondWith(res, { code: 200, message: 'Password updated successfully!' });
}

export default {
  login,
  signup,
  me,
  changePassword,
};
