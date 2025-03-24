import { z } from 'zod';
import { idSchema } from '../middlewares/idValidator';

const DATE_REGEXP = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

export const BookDtoSchema = z.object({
  isbn: z.string({ required_error: 'Please provide ISBN' }).min(2).max(13),
  title: z.string({ required_error: 'Please provide title' }).min(2).max(100),
  image: z
    .string({ required_error: 'Please provide image' })
    .url('Please provide a somewhat valid url.'),
  publisher: z.string({ required_error: 'Please provide publisher' }).min(2).max(100),
  publishedDate: z
    .string({ required_error: 'Please provide publishedDate' })
    .regex(DATE_REGEXP, 'Please provide a valid date. Example: 2021-01-01'),
  status: z.enum(['available', 'borrowed']).optional().default('available'),
  borrowerId: z.string().optional(),
  borrowDate: z
    .string()
    .regex(DATE_REGEXP, 'Please provide a valid borrowDate. Example: 2021-01-01')
    .optional(),
  returnDate: z
    .string()
    .regex(DATE_REGEXP, 'Please provide a valid returnDate. Example: 2021-01-01')
    .optional(),
  authors: z.array(idSchema).optional(),
  genres: z.array(idSchema).optional(),
});

export const BookIsbnParamSchema = z.object({
  isbn: z.string({ required_error: 'Please provide ISBN' }),
});

export const BookFiltersSchema = z.object({
  author: z.string().optional().default(''),
  genre: z.string().optional().default(''),
  title: z.string().optional().default(''),
  status: z.enum(['available', 'borrowed', '']).optional().default(''),
});
