import request from 'supertest';
import connect, { MongoHelper } from '../dbHelper';
import app from '../..';

import Book from '../../models/Book';
import GenreModel from '../../models/Genre';
import BookGenre from '../../models/BookGenre';
import genresFixture from '../__fixtures__/genres';
import booksFixture from '../__fixtures__/books';
import { createUser } from '../__fixtures__/createUser';
import { createAdmin } from '../__fixtures__/createAdmin';

describe('gernesController', () => {
  let mongoHelper: MongoHelper;
  let nonExitID: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    nonExitID = '10566c2227fb4cb14cc85fdc';
  });

  beforeEach(async () => {
    await Book.deleteMany({});
    await GenreModel.deleteMany({});
    await BookGenre.deleteMany({});
  });

  it('get /genres', async () => {
    const response = await request(app).get('/api/v1/genres').send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: { genres: [], pagination: { page: 1, totalPages: 0 } },
      status: 'success',
    });
  });

  it('should not get /genres with incorrect pagination', async () => {
    const response = await request(app).get('/api/v1/genres?page=0&limit=0').send();
    expect(response.status).toBe(400);
  });

  it('get an existing genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await request(app).get(`/api/v1/genres/${newGenre.id}`).send();
    expect(response.status).toBe(200);
  });

  it('should not get a non-existing genre', async () => {
    const response = await request(app).get(`/api/v1/genres/${nonExitID}`).send();
    expect(response.status).toBe(404);
  });

  it('get all books by a genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const newBook1 = await Book.create(booksFixture[0]);
    const newBook2 = await Book.create(booksFixture[1]);
    await BookGenre.create({ bookId: newBook1.id, genreId: newGenre.id });
    await BookGenre.create({ bookId: newBook2.id, genreId: newGenre.id });
    const response = await request(app).get(`/api/v1/genres/${newGenre.id}/books`).send();

    expect(response.status).toBe(200);
    expect(response.body.data.books.length).toBe(2);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('genresController protected routes as user', () => {
  let mongoHelper: MongoHelper;
  let token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken } = await createUser();
    token = accessToken;
  });

  beforeEach(async () => {
    await GenreModel.deleteMany({});
  });

  it('should not allow to create a genre', async () => {
    const response = await request(app)
      .post('/api/v1/genres')
      .set('Authorization', `Bearer ${token}`)
      .send(genresFixture[0]);
    expect(response.status).toBe(403);
  });

  it('should not allow to update a genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await request(app)
      .put(`/api/v1/genres/${newGenre.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated genre' });
    expect(response.status).toBe(403);
  });

  it('should not allow to delete a genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await request(app)
      .delete(`/api/v1/genres/${newGenre.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('genresController protected routes as admin', () => {
  let mongoHelper: MongoHelper;
  let token: string;
  let nonExitID: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken } = await createAdmin();
    token = accessToken;
    nonExitID = '10566c2227fb4cb14cc85fdc';
  });

  beforeEach(async () => {
    await GenreModel.deleteMany({});
  });

  it('creates a genre', async () => {
    const response = await request(app)
      .post('/api/v1/genres')
      .set('Authorization', `Bearer ${token}`)
      .send(genresFixture[0]);
    expect(response.status).toBe(201);
  });

  it('should not create a genre with invalid genreDTO', async () => {
    const response = await request(app)
      .post('/api/v1/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(response.status).toBe(400);
  });

  it('updates existing genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await request(app)
      .put(`/api/v1/genres/${newGenre.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated genre',
      });
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated genre');
  });

  it('should not update non-existing genre', async () => {
    const response = await request(app)
      .put(`/api/v1/genres/${nonExitID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated title' });
    expect(response.status).toBe(404);
  });

  it('deletes a genre', async () => {
    const newGenre = await GenreModel.create(genresFixture[0]);
    const response = await request(app)
      .delete(`/api/v1/genres/${newGenre.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
