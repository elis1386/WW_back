import express from 'express';

import {
  getAllAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getAuthorsBooks,
} from '../controllers/authorsController';
import { errorLoggingMiddleware } from '../middlewares/error';
import { passThrowsToMiddleware } from '../utils/passThrowsToMiddleware';
import authorsValidator from '../middlewares/authorsValidator';
import { checkAuth } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';
import { validatePagination } from '../middlewares/paginationValidator';

export const authorsRouter = express.Router();
authorsRouter.use(errorLoggingMiddleware);

authorsRouter.get('/', validatePagination, passThrowsToMiddleware(getAllAuthors));
authorsRouter.get('/:id', authorsValidator.authorIdValidate, passThrowsToMiddleware(getAuthorById));
authorsRouter.get(
  '/:id/books',
  authorsValidator.authorIdValidate,
  validatePagination,
  passThrowsToMiddleware(getAuthorsBooks)
);
authorsRouter.post(
  '/',
  checkAuth,
  checkAdmin,
  authorsValidator.validateAuthorInput,
  passThrowsToMiddleware(createAuthor)
);

authorsRouter.put(
  '/:id',
  checkAuth,
  checkAdmin,
  authorsValidator.validateAuthorInput,
  passThrowsToMiddleware(updateAuthor)
);
authorsRouter.delete(
  '/:id',
  checkAuth,
  checkAdmin,
  authorsValidator.authorIdValidate,
  passThrowsToMiddleware(deleteAuthor)
);
