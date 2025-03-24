import { Request, Response } from 'express';
import BooksService from '../services/booksService';
import StatusLogger from '../utils/statusLogger';
import { BookDto } from '../types/books';
import { getFindAllBooksOptionsFromQuery } from '../utils/books';
import respondWith from '../utils/respondWith';

async function getAllBooks(req: Request, res: Response) {
  const options = await getFindAllBooksOptionsFromQuery(req.query); // TODO: Think of a way to get parsed/default query params from middleware, i.e. through req object mutation
  const data = await BooksService.findAll(options);
  respondWith(res, { code: 200, data });
}

async function getBookByIsbn(req: Request<{ isbn: string }>, res: Response) {
  const { isbn } = req.params;
  const book = await BooksService.findOne(isbn);
  respondWith(res, { code: 200, data: book });
}

async function createBook(req: Request<unknown, unknown, BookDto>, res: Response) {
  const bookDto = req.body;
  const newBook = await BooksService.createOne(bookDto);
  StatusLogger.created('books', newBook.id);
  respondWith(res, { code: 201, data: newBook });
}

async function updateBookByIsbn(req: Request<{ isbn: string }, unknown, BookDto>, res: Response) {
  const { isbn } = req.params;
  const bookDto = req.body;
  const updatedBook = await BooksService.updateOne(isbn, bookDto);
  respondWith(res, { code: 200, data: updatedBook });
}

async function deleteBookByIsbn(req: Request<{ isbn: string }>, res: Response) {
  const { isbn } = req.params;
  await BooksService.deleteOne(isbn);
  respondWith(res, { code: 204 });
}

export default {
  getAllBooks,
  getBookByIsbn,
  createBook,
  updateBookByIsbn,
  deleteBookByIsbn,
};
