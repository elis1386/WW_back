import express from 'express';
import UsersController from '../controllers/usersController';
import { passThrowsToMiddleware } from '../utils/passThrowsToMiddleware';
import { validateId } from '../middlewares/idValidator';
import { validateUserDtoInput } from '../middlewares/usersValidator';
import { checkAuth } from '../middlewares/checkAuth';
import { checkAdminRoleOrOwnership } from '../middlewares/checkAdminRoleOrOwnership';
import { checkAdmin } from '../middlewares/checkAdmin';

export const userRouter = express.Router();

userRouter.get('/', checkAuth, checkAdmin, passThrowsToMiddleware(UsersController.getAllUsers));
userRouter.get(
  '/:id',
  validateId,
  checkAuth,
  checkAdminRoleOrOwnership,
  passThrowsToMiddleware(UsersController.getUserById)
);

userRouter.post(
  '/:id/borrow',
  validateId,
  checkAuth,
  checkAdminRoleOrOwnership,
  passThrowsToMiddleware(UsersController.borrowBooks)
);
userRouter.post(
  '/:id/return',
  validateId,
  checkAuth,
  checkAdminRoleOrOwnership,
  passThrowsToMiddleware(UsersController.returnBooks)
);

userRouter.put(
  '/:id',
  validateId,
  checkAuth,
  checkAdminRoleOrOwnership,
  validateUserDtoInput,
  passThrowsToMiddleware(UsersController.updateUserById)
);

userRouter.delete(
  '/:id',
  validateId,
  checkAuth,
  checkAdminRoleOrOwnership,
  passThrowsToMiddleware(UsersController.deleteUserById)
);

userRouter.put(
  '/:id/role',
  validateId,
  checkAuth,
  checkAdmin,
  passThrowsToMiddleware(UsersController.changeRole)
);

export default userRouter;
