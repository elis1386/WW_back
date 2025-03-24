import { PaginationType } from '../types/pagination';
import { PaginationSchema } from '../schemas/pagination';

/**
 * Gets pagination options from query params of the request.
 * Parses the given query object and returns a PaginationType object.
 *
 * @param query The req.query object.
 *
 * @returns A promise that resolves to a PaginationType object either parsed from the query or with default values.
 */
export async function getPaginationOptionsFromQuery(query: qs.ParsedQs): Promise<PaginationType> {
  const pagination = await PaginationSchema.parseAsync(query);
  return pagination;
}

/**
 * Composes pagination output from the given entities count and pagination options.
 *
 * @param entitiesCount The total number of entities.
 * @param pagination The pagination options.
 */
export function composePaginationOutput(entitiesCount: number, pagination: PaginationType) {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(entitiesCount / limit);
  return {
    page,
    totalPages,
  };
}
