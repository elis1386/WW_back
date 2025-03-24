import z from 'zod';

const DEFAULT_ENTITIES_PER_PAGE = 50;

// Coerce allows to mutate the value to the desired type.
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(DEFAULT_ENTITIES_PER_PAGE),
});
