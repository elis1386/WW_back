import mongoose from 'mongoose';
import { FindAllBooksOptions } from '../../types/books';
import { mapPaginationToMongoose } from '../../utils/mongoose';
import Author from '../Author';
import Genre from '../Genre';

export const populateAuthorsOptions = {
  path: 'authors',
  select: 'authorId',
  populate: {
    path: 'authorId',
    model: 'Author',
    select: 'name',
  },
  transform: (doc: { authorId: typeof Author }) => {
    return doc.authorId;
  },
};

export const populateGenresOptions = {
  path: 'genres',
  select: 'genreId',
  populate: {
    path: 'genreId',
    model: 'Genre',
    select: 'title',
  },
  transform: (doc: { genreId: typeof Genre }) => {
    return doc.genreId;
  },
};

function composeAuthorAggregation(authorId: string) {
  if (!authorId) return [];
  return [
    {
      'authorsbridge.authorId': {
        $eq: new mongoose.Types.ObjectId(authorId),
      },
    },
  ];
}

function composeGenreAggregation(genreId: string) {
  if (!genreId) return [];
  return [
    {
      'genresbridge.genreId': {
        $eq: new mongoose.Types.ObjectId(genreId),
      },
    },
  ];
}

function composeTitleAggregation(title: string) {
  return [
    {
      title: {
        $regex: title,
        $options: 'i',
      },
    },
  ];
}

function composeStatusAggregation(status: string) {
  if (!status) return [];
  return [
    {
      status,
    },
  ];
}

/**
 * Composes an aggregation pipeline for Book model.
 *
 * @param options - Books Filters & Pagination options
 * @returns An aggregation pipeline
 */
export function composeAggregationFromOptions(options: FindAllBooksOptions) {
  const pagination = mapPaginationToMongoose(options);
  return [
    {
      $lookup: {
        from: 'bookauthors',
        localField: '_id',
        foreignField: 'bookId',
        as: 'authorsbridge',
      },
    },
    {
      $lookup: {
        from: 'bookgenres',
        localField: '_id',
        foreignField: 'bookId',
        as: 'genresbridge',
      },
    },
    {
      $match: {
        $and: [
          ...composeAuthorAggregation(options.author),
          ...composeGenreAggregation(options.genre),
          ...composeTitleAggregation(options.title),
          ...composeStatusAggregation(options.status),
        ],
      },
    },
    {
      $facet: {
        books: [
          {
            $skip: pagination.skip,
          },
          {
            $limit: pagination.limit,
          },
        ],
        total: [
          {
            $count: 'total',
          },
        ],
      },
    },
  ];
}
