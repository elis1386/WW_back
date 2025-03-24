import { TitleQueryParamSchema } from '../schemas/genre';
import { TitleQueryParamsType, GenreQueryParamsType } from '../types/genres';
import { getPaginationOptionsFromQuery } from './pagination';

export async function getTitleFromQuery(query: qs.ParsedQs): Promise<TitleQueryParamsType> {
  const result = await TitleQueryParamSchema.parseAsync(query);
  return result;
}

export async function getGetAllGenresOptionsFromQuery(
  query: qs.ParsedQs
): Promise<GenreQueryParamsType> {
  const title = await getTitleFromQuery(query);
  const pagination = await getPaginationOptionsFromQuery(query);
  return { ...title, ...pagination };
}
