import { AuthorDto, AuthorFilters, FindAllAuthorsOptions } from '../types/authors';
import Author from '../models/Author';
import { ApiError } from '../errors/ApiError';
import BookAuthor from '../models/BookAuthor';
import { mapPaginationToMongoose } from '../utils/mongoose';
import { composePaginationOutput } from '../utils/pagination';
import { BookType } from '../types/books';

const getAll = async (options: FindAllAuthorsOptions, name?: AuthorFilters) => {
  const pagination = mapPaginationToMongoose(options);
  let query = {};
  if (name) {
    query = { name: { $regex: name, $options: 'i' } };
  }
  const authors = await Author.find(query, {}, pagination);
  const authorsCount = await Author.countDocuments(query);
  return { authors, pagination: composePaginationOutput(authorsCount, options) };
};

const getBooksByAuthor = async (authorId: string, options: FindAllAuthorsOptions) => {
  const author = await Author.findById(authorId);
  if (!author) {
    throw ApiError.resourceNotFound('Author not exits');
  }
  const pagination = mapPaginationToMongoose(options);
  const bookAuthor = (await BookAuthor.find({ authorId: author._id }, {}, pagination).populate({
    path: 'bookId',
    model: 'Book',
  })) as { bookId: BookType }[];
  const books = bookAuthor.map((book) => book.bookId);
  const booksCount = await BookAuthor.countDocuments({ authorId: author._id });
  return { books, pagination: composePaginationOutput(booksCount, options) };
};

const createNewAuthor = async (newAuthor: AuthorDto) => {
  const author = new Author(newAuthor);
  await author.save();
  return author;
};

const getById = async (authorId: string) => {
  const author = await Author.findById(authorId);
  if (!author) {
    throw ApiError.resourceNotFound('Author not found');
  }
  return author;
};

const updateById = async (authorId: string, author: AuthorDto) => {
  const updatedAuthor = await Author.findByIdAndUpdate(authorId, author, { new: true });
  if (!author) {
    throw ApiError.resourceNotFound('Author not found');
  }
  return updatedAuthor;
};

const deleteById = async (authorId: string) => {
  const author = await Author.findById(authorId);
  if (!author) {
    throw ApiError.resourceNotFound('Author not found');
  }
  await Author.findByIdAndDelete(authorId);
  await BookAuthor.deleteMany({ authorId });
};

export default { getAll, createNewAuthor, getById, updateById, deleteById, getBooksByAuthor };
