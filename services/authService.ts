import { UserType } from '../types/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersService from './usersService';
import { LoginCredentialsType, SignupCredentialsType, UpdatePasswordType } from '../types/auth';
import { ApiError } from '../errors/ApiError';
import _ from 'lodash';

export const SALT_ROUNDS = 12;

const encodeJwtToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.TOKEN_SECRET as string);
  return token;
};

const signup = async (signupData: SignupCredentialsType) => {
  const emailTaken = await UsersService.findOneByEmail(signupData.email);
  if (emailTaken) {
    throw ApiError.badRequest('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(signupData.password, SALT_ROUNDS);
  const user = await UsersService.createOne({
    ...signupData,
    password: hashedPassword,
  });

  return {
    accessToken: encodeJwtToken(user.id),
    user,
  };
};

const login = async (loginCredentials: LoginCredentialsType) => {
  const user = await UsersService.findOneByEmail(loginCredentials.email);
  if (!user) {
    throw ApiError.forbidden('Bad credentials');
  }

  const isValid = await bcrypt.compare(loginCredentials.password, user.password);
  if (!isValid) {
    throw ApiError.forbidden('Bad credentials');
  }

  const accessToken = encodeJwtToken(user.id);

  return {
    accessToken,
    user,
  };
};

const me = async (user: UserType) => {
  return user.populate('borrowedBooks');
};

const changePassword = async (userId: string, passwords: UpdatePasswordType) => {
  const user = await UsersService.findOne(userId);
  if (!user) {
    throw ApiError.resourceNotFound('User not found');
  }

  const isValid = await bcrypt.compare(passwords.oldPassword, user.password);
  if (!isValid) {
    throw ApiError.forbidden('Wrong password');
  }

  const hashedPassword = await bcrypt.hash(passwords.newPassword, SALT_ROUNDS);
  const updatedUser = await user.updateOne(
    {
      password: hashedPassword,
    },
    { new: true }
  );

  return updatedUser;
};

export default {
  signup,
  login,
  me,
  changePassword,
};
