import request from 'supertest';
import connect, { MongoHelper } from '../dbHelper';
import app from '../..';
import { createAdmin } from '../__fixtures__/createAdmin';
import booksFixture from '../__fixtures__/books';
import { createUser } from '../__fixtures__/createUser';
import Book from '../../models/Book';

describe('booksController', () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  test('get /books', async () => {
    const response = await request(app).get('/api/v1/books').send();
    expect(response.status).toBe(200);
    expect(response.body.data.books).toEqual([]);
  });

  test('get /books with incorrect pagination fails', async () => {
    const response = await request(app).get('/api/v1/books?page=0&limit=0').send();
    expect(response.status).toBe(400);
  });

  test('get existing book by isbn', async () => {
    await Book.create(booksFixture[0]);
    const response = await request(app).get(`/api/v1/books/${booksFixture[0].isbn}`).send();
    expect(response.status).toBe(200);
  });

  test('get non-existing book by isbn fails', async () => {
    const response = await request(app).get(`/api/v1/books/${booksFixture[1].isbn}`).send();
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('booksController protected routes – user', () => {
  let mongoHelper: MongoHelper;
  let token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken } = await createUser();
    await Book.create(booksFixture[0]);
    token = accessToken;
  });

  it('should not allow to create a book', async () => {
    const response = await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send(booksFixture[0]);
    expect(response.status).toBe(403);
  });

  it('should not allow to update a book by ISBN', async () => {
    const response = await request(app)
      .put(`/api/v1/books/${booksFixture[0].isbn}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...booksFixture[0], title: 'Updated title' });
    expect(response.status).toBe(403);
  });

  it('should not allow to delete a book by ISBN', async () => {
    const response = await request(app)
      .delete(`/api/v1/books/${booksFixture[0].isbn}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('booksController protected routes – admin', () => {
  let mongoHelper: MongoHelper;
  let token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken } = await createAdmin();
    token = accessToken;
  });

  it('creates a book', async () => {
    const response = await request(app)
      .post('/api/v1/books')
      .set('Authorization', `Bearer ${token}`)
      .send(booksFixture[0]);
    expect(response.status).toBe(201);
  });

  it('updates existing book by ISBN', async () => {
    const response = await request(app)
      .put(`/api/v1/books/${booksFixture[0].isbn}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...booksFixture[0],
        title: 'Updated title',
      });
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated title');
  });

  it('fails to update non-existing book by ISBN', async () => {
    const response = await request(app)
      .put(`/api/v1/books/${booksFixture[1].isbn}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...booksFixture[1], title: 'Updated title' });
    expect(response.status).toBe(404);
  });

  it('deletes a book by ISBN', async () => {
    const response = await request(app)
      .delete(`/api/v1/books/${booksFixture[0].isbn}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('fails to delete non-existing book by ISBN', async () => {
    const response = await request(app)
      .delete(`/api/v1/books/${booksFixture[1].isbn}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
