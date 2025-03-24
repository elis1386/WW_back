import express from 'express';
import { passThrowsToMiddleware } from '../utils/passThrowsToMiddleware';
import AuthController from '../controllers/authController';
import AuthValidator from '../middlewares/authValidator';
import { checkAuth } from '../middlewares/checkAuth';

export const authRouter = express.Router();

authRouter.post(
  '/login',
  AuthValidator.validateLoginCredentials,
  passThrowsToMiddleware(AuthController.login)
);

authRouter.post(
  '/signup',
  AuthValidator.validateSignupInput,
  passThrowsToMiddleware(AuthController.signup)
);

authRouter.get('/me', checkAuth, passThrowsToMiddleware(AuthController.me));

authRouter.post(
  '/change-password',
  checkAuth,
  AuthValidator.validateUpdatePasswordInput,
  passThrowsToMiddleware(AuthController.changePassword)
);
