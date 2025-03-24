import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async function so that any errors are passed to next().
 * So there is no need to use try/catch in the controller functions.
 *
 * @param controller The controller function to wrap.
 */
export const passThrowsToMiddleware = <
  Req extends Request,
  Res extends Response,
  N extends NextFunction,
>(
  controller: (req: Req, res: Res, next: N) => Promise<void>
) => {
  return (req: Req, res: Res, next: N) =>
    controller(req, res, next).catch(next); // 👈🏻the main thing
};
