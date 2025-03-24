import Genre from '../../models/Genre';
import BooksService from '../../services/booksService';
import genresFixture from '../__fixtures__/genres';
import authorsFixture from '../__fixtures__/authors';
import booksFixture from '../__fixtures__/books';
import connect, { MongoHelper } from '../dbHelper';
import Author from '../../models/Author';
import _ from 'lodash';

describe('BooksService', () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  it('should create records in bridge tables when genres and authors are provided', async () => {
    const genre = await Genre.create(genresFixture[0]);
    const author = await Author.create(authorsFixture[0]);
    const book = await BooksService.createOne({
      ...booksFixture[0],
      status: 'available',
      genres: [genre.id],
      authors: [author.id],
    });

    expect(_.get(book, ['genres', 0, 'title'])).toBe(genre.title);
    expect(_.get(book, ['authors', 0, 'name'])).toBe(author.name);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
