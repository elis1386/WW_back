import { Request, Response } from 'express';

export function routeNotFound(_req: Request, res: Response) {
  res.status(404).json({ msg: 'Route Not Found.' });
}
