import { NextFunction, Request, Response } from 'express';
import { AuthorDtoSchema } from '../schemas/authors';
import { validateId } from './idValidator';

const authorIdValidate = validateId;

async function validateAuthorInput(req: Request, res: Response, next: NextFunction) {
  try {
    await AuthorDtoSchema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
}

export default {
  validateAuthorInput,
  authorIdValidate,
};
