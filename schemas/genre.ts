import { z } from 'zod';

export const genreSchema = z.object({
  title: z.string().min(1, {
    message: 'Title must not be empty',
  }),
});

export const TitleQueryParamSchema = z.object({
  title: z.string().default(''),
});
