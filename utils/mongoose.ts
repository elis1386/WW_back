import { PaginationType } from '../types/pagination';

/**
 * Translates pagination options {page, limit} to mongoose options {skip, limit}
 *
 * @param options Pagination options {page, limit}
 * @returns Promise resolving to mongoose options {skip, limit}
 */
export function mapPaginationToMongoose(options: PaginationType) {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  return { skip, limit };
}
