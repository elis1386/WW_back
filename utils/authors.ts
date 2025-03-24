import { FindAllAuthorsOptions } from '../types/authors';
import { getPaginationOptionsFromQuery } from '../utils/pagination';

/**
 * Parses query params and gets pagination and filtering options for AuthorService.getAll.
 *
 * @param query Express request query.
 * @returns Promise resolving to FindAllAuthorsOptions.
 */
export async function getFindAllAuthorsOptionsFromQuery(
  query: qs.ParsedQs
): Promise<FindAllAuthorsOptions> {
  const pagination = await getPaginationOptionsFromQuery(query);
  return { ...pagination };
}
