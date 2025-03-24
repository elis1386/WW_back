import { Request, Response } from 'express';

import AuthorsService from '../services/authorsService';
import { AuthorFilters } from '../types/authors';
import { getFindAllAuthorsOptionsFromQuery } from '../utils/authors';
import { getPaginationOptionsFromQuery } from '../utils/pagination';
import respondWith from '../utils/respondWith';

export const getAllAuthors = async (req: Request, res: Response) => {
  const options = await getFindAllAuthorsOptionsFromQuery(req.query);
  const authorName = req.query.name as AuthorFilters;
  const authors = await AuthorsService.getAll(options, authorName);
  respondWith(res, { code: 200, data: authors });
};

export const getAuthorsBooks = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pagination = await getPaginationOptionsFromQuery(req.query);
  const book = await AuthorsService.getBooksByAuthor(id, pagination);
  respondWith(res, { code: 200, data: book });
};

export const createAuthor = async (req: Request, res: Response) => {
  const createdAuthor = await AuthorsService.createNewAuthor(req.body);
  respondWith(res, { code: 201, data: createdAuthor });
};

export const getAuthorById = async (req: Request, res: Response) => {
  const author = await AuthorsService.getById(req.params.id);
  respondWith(res, { code: 200, data: author });
};

export const updateAuthor = async (req: Request, res: Response) => {
  const updatedAuthor = await AuthorsService.updateById(req.params.id, req.body);
  respondWith(res, { code: 200, data: updatedAuthor });
};

export const deleteAuthor = async (req: Request, res: Response) => {
  await AuthorsService.deleteById(req.params.id);
  respondWith(res, { code: 204 });
};
