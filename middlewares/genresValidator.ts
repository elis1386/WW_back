import { NextFunction, Request, Response } from 'express';
import { genreSchema } from '../schemas/genre';
import { getGetAllGenresOptionsFromQuery } from '../utils/genres';

async function validateGenreDtoInput(req: Request, res: Response, next: NextFunction) {
  try {
    await genreSchema.parseAsync(req.body);
    return next();
  } catch (error) {
    res.status(400).json(error);
  }
}

async function validateGenreParamQuery(req: Request, res: Response, next: NextFunction) {
  try {
    await getGetAllGenresOptionsFromQuery(req.query);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
}

export default {
  validateGenreDtoInput,
  validateGenreParamQuery,
};
