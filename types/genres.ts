import z from 'zod';
import { genreSchema } from '../schemas/genre';
import { TitleQueryParamSchema } from '../schemas/genre';
import { PaginationType } from './pagination';

export type GenreDTO = z.infer<typeof genreSchema>;
export type GenreType = GenreDTO & { id: string };

export type TitleQueryParamsType = z.infer<typeof TitleQueryParamSchema>;
export type GenreQueryParamsType = z.mergeTypes<PaginationType, TitleQueryParamsType>;
