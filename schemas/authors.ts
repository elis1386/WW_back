import { z } from 'zod';

export const AuthorDtoSchema = z.object({
  name: z.string({ required_error: 'Please provide author name' }),
  bio: z.string({ required_error: 'Please provide author bio' }),
  image: z
    .string({ required_error: 'Please provide image' })
    .url('Please provide a somewhat valid url.'),
});
