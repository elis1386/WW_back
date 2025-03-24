import { booksRouter } from './booksRoute';
import { genresRouter } from './genresRoute';
import userRouter from './usersRoute';
import express from 'express';
import { authorsRouter } from './authorsRoute';
import { authRouter } from './authRoute';

export const router = express.Router();

// Set your routes here by entity as follows:
router.use('/books', booksRouter);
router.use('/genres', genresRouter);
router.use('/authors', authorsRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
