import { z } from 'zod';
import { AuthorDtoSchema } from '../schemas/authors';
import { PaginationType } from './pagination';

export type AuthorDto = z.infer<typeof AuthorDtoSchema>;
export type AuthorType = z.mergeTypes<{ id: string }, AuthorDto>;
export type AuthorFilters = string | null;
export type FindAllAuthorsOptions = z.mergeTypes<PaginationType, AuthorFilters>;
