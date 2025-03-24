import { NextFunction, Request, Response } from 'express';
import { getPaginationOptionsFromQuery } from '../utils/pagination';

/**
 * Middleware to validate pagination params (page and limit).
 */
export async function validatePagination(req: Request, res: Response, next: NextFunction) {
  try {
    await getPaginationOptionsFromQuery(req.query);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
}
