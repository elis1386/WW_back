import { Request, Response } from 'express';

import genreService from '../services/genresService';
import { GenreDTO } from '../types/genres';
import { getPaginationOptionsFromQuery } from '../utils/pagination';
import { getGetAllGenresOptionsFromQuery } from '../utils/genres';
import respondWith from '../utils/respondWith';

const getAllGenre = async (req: Request, res: Response) => {
  const options = await getGetAllGenresOptionsFromQuery(req.query);
  const genreInDB = await genreService.getAll(options);
  respondWith(res, { code: 200, data: genreInDB });
};

const getOneGenre = async (req: Request, res: Response) => {
  const id = req.params.id;
  const foundGenre = await genreService.getOne(id);
  respondWith(res, { code: 200, data: foundGenre });
};

const getAllBooksByGenre = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pagination = await getPaginationOptionsFromQuery(req.query);
  const allBooks = await genreService.getAllBooks(id, pagination);
  respondWith(res, { code: 200, data: allBooks });
};

const createGenre = async (req: Request, res: Response) => {
  const body = req.body as GenreDTO;
  const newGenre = await genreService.create(body);
  respondWith(res, { code: 201, data: newGenre });
};

const updateGenre = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body as GenreDTO;
  const updatedGenre = await genreService.update(id, body);
  respondWith(res, { code: 200, data: updatedGenre });
};

const deleteGenre = async (req: Request, res: Response) => {
  const id = req.params.id;
  await genreService.remove(id);
  respondWith(res, { code: 204 });
};

export default {
  getAllGenre,
  getOneGenre,
  getAllBooksByGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};
