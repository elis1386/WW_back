import { ApiError } from '../errors/ApiError';
import GenreModel from '../models/Genre';
import BookGenre from '../models/BookGenre';
import { PaginationType } from '../types/pagination';
import { GenreDTO, GenreQueryParamsType } from '../types/genres';
import { mapPaginationToMongoose } from '../utils/mongoose';
import { composePaginationOutput } from '../utils/pagination';

const getAll = async (options: GenreQueryParamsType) => {
  const paginationOption = mapPaginationToMongoose({ page: options.page, limit: options.limit });
  const genres = await GenreModel.find(
    { title: { $regex: options.title, $options: 'i' } },
    {},
    paginationOption
  );
  const entitiesCount = await GenreModel.countDocuments({
    title: { $regex: options.title, $options: 'i' },
  });
  const pagination = composePaginationOutput(entitiesCount, {
    page: options.page,
    limit: options.limit,
  });
  return { genres, pagination };
};

const getOne = async (id: string) => {
  const genre = await GenreModel.findById(id);
  if (!genre) {
    throw ApiError.resourceNotFound('Genre not exits');
  }
  return genre;
};

const getAllBooks = async (id: string, pagination: PaginationType) => {
  const genre = await GenreModel.findById(id);
  if (!genre) {
    throw ApiError.resourceNotFound('Genre not exits');
  }
  const paginationOption = mapPaginationToMongoose(pagination);
  const bookGenres = await BookGenre.find({ genreId: genre._id }, {}, paginationOption).populate({
    path: 'bookId',
    model: 'Book',
  });
  const entitiesCount = await BookGenre.countDocuments({ genreId: genre._id });
  const paginationOutput = composePaginationOutput(entitiesCount, pagination);
  const books = bookGenres.map((bookGenre) => bookGenre.bookId);
  return { books, pagination: paginationOutput };
};

const create = async (genre: GenreDTO) => {
  const newGenre = new GenreModel(genre);
  const savedGenre = await newGenre.save();
  return savedGenre;
};

const update = async (id: string, genre: GenreDTO) => {
  // By default, findByIdAndUpdate will return the document before the update was applied.
  const updatedGenre = await GenreModel.findByIdAndUpdate(id, genre, {
    returnDocument: 'after',
  });
  if (!updatedGenre) {
    throw ApiError.resourceNotFound('Genre not exits');
  }
  return updatedGenre;
};

const remove = async (id: string) => {
  await GenreModel.findByIdAndDelete(id);
  await BookGenre.deleteMany({ genreId: id });
};

export default { getAll, getOne, getAllBooks, create, update, remove };
