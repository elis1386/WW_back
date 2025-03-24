import express from 'express';
import BooksController from '../controllers/booksController';
import BooksValidator from '../middlewares/booksValidator';
import { passThrowsToMiddleware } from '../utils/passThrowsToMiddleware';
import { checkAuth } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';

export const booksRouter = express.Router();

booksRouter.get(
  '/',
  BooksValidator.validateBookOptions,
  passThrowsToMiddleware(BooksController.getAllBooks)
);
booksRouter.get(
  '/:isbn',
  BooksValidator.validateBookIsbnParam,
  passThrowsToMiddleware(BooksController.getBookByIsbn)
);
booksRouter.post(
  '/',
  checkAuth,
  checkAdmin,
  BooksValidator.validateBookDtoInput,
  passThrowsToMiddleware(BooksController.createBook)
);
booksRouter.put(
  '/:isbn',
  checkAuth,
  checkAdmin,
  BooksValidator.validateBookIsbnParam,
  BooksValidator.validateBookDtoInput,
  passThrowsToMiddleware(BooksController.updateBookByIsbn)
);
booksRouter.delete(
  '/:isbn',
  checkAuth,
  checkAdmin,
  BooksValidator.validateBookIsbnParam,
  passThrowsToMiddleware(BooksController.deleteBookByIsbn)
);
