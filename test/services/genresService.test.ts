import connect, { MongoHelper } from '../dbHelper';

import Book from '../../models/Book';
import Author from '../../models/Author';
import BookGenre from '../../models/BookGenre';
import GenreModel from '../../models/Genre';
import BookAuthor from '../../models/BookAuthor';
import genreService from '../../services/genresService';
import booksFixture from '../__fixtures__/books';
import genresFixture from '../__fixtures__/genres';
import authorsFixture from '../__fixtures__/authors';

describe('gernesService', () => {
  let mongoHelper: MongoHelper;
  let nonExitID: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    nonExitID = '10566c2227fb4cb14cc85fdc';
  });

  beforeEach(async () => {
    await GenreModel.deleteMany({});
  });

  it('GET /genres returns proper format response', async () => {
    const options = {
      title: '',
      page: 1,
      limit: 20,
    };
    const response = await genreService.getAll(options);
    expect(response).toMatchObject({ genres: [], pagination: { page: 1, totalPages: 0 } });
  });

  it('GET /genres/:id returns one genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await genreService.getOne(newGenre.id);
    expect(response).toMatchObject(genresFixture[0]);
  });

  it('GET /genres/:id return an error object with non existing genre', async () => {
    try {
      await genreService.getOne(nonExitID);
    } catch (error) {
      expect(error).toMatchObject({ code: 404, message: 'Genre not exits' });
    }
  });

  it('GET /genres/:id/books returns all books of that genre', async () => {
    const options = {
      page: 1,
      limit: 20,
    };
    const newGenre = await GenreModel.create(genresFixture[0]);
    const newBook1 = await Book.create(booksFixture[0]);
    const newBook2 = await Book.create(booksFixture[1]);
    const newAuthor = await Author.create(authorsFixture[0]);
    await BookGenre.create({ bookId: newBook1.id, genreId: newGenre.id });
    await BookGenre.create({ bookId: newBook2.id, genreId: newGenre.id });
    await BookAuthor.create({ bookId: newBook1.id, authorId: newAuthor.id });
    const response = await genreService.getAllBooks(newGenre.id, options);
    expect(response.books.length).toBe(2);
  });

  it('GET /genres/:id/books return an error object with non existing genre', async () => {
    try {
      const options = {
        page: 1,
        limit: 20,
      };
      await genreService.getAllBooks(nonExitID, options);
    } catch (error) {
      expect(error).toMatchObject({ code: 404, message: 'Genre not exits' });
    }
  });

  it('POST /genres creates a genre', async () => {
    const response = await genreService.create(genresFixture[0]);
    expect(response).toMatchObject(genresFixture[0]);
  });

  it('PUT /genres/:id updates a genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await genreService.update(newGenre.id, genresFixture[1]);
    expect(response).toMatchObject(genresFixture[1]);
  });

  it('DELETE /genres/:id removes a genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    await genreService.remove(newGenre.id);
    const findGenre = await GenreModel.findById(newGenre.id);
    expect(findGenre).toEqual(null);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
