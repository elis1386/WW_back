import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const idSchema = z.string().regex(/^[a-fA-F\d]{24}$/, 'Invalid ID');

export const validateId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await idSchema.parseAsync(req.params.id);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};
