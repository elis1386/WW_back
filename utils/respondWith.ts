import { Response } from 'express';

const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';

interface RespondWithOptions {
  code: number;
  data?: unknown;
  message?: string;
}

export default function respondWith(
  res: Response,
  { code, data = null, message = '' }: RespondWithOptions
) {
  const status = code >= 200 && code < 400 ? STATUS_SUCCESS : STATUS_ERROR;
  return res.status(code).json({
    status,
    data,
    ...(message && { message }),
  });
}
