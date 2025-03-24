import { BookFiltersSchema } from '../schemas/book';
import { FindAllBooksOptions } from '../types/books';
import { getPaginationOptionsFromQuery } from '../utils/pagination';

async function getFindAllBooksFiltersFromQuery(query: qs.ParsedQs) {
  const filters = await BookFiltersSchema.parseAsync(query);
  return filters;
}

/**
 * Parses query params and gets pagination and filtering options for BooksService.findAll.
 *
 * @param query Express request query.
 * @returns Promise resolving to FindAllBooksOptions.
 */
export async function getFindAllBooksOptionsFromQuery(
  query: qs.ParsedQs
): Promise<FindAllBooksOptions> {
  const pagination = await getPaginationOptionsFromQuery(query);
  const filters = await getFindAllBooksFiltersFromQuery(query);
  return { ...pagination, ...filters };
}
