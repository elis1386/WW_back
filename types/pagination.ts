import z from 'zod';
import { PaginationSchema } from '../schemas/pagination';

export type PaginationType = z.infer<typeof PaginationSchema>;
