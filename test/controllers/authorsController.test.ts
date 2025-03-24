import request from 'supertest';
import mongoose from 'mongoose';

import connect, { MongoHelper } from '../dbHelper';
import app from '../../index';
import authorsFixture from '../__fixtures__/authors';
import Author from '../../models/Author';
import { createAdmin } from '../__fixtures__/createAdmin';
import { createUser } from '../__fixtures__/createUser';

describe('authorsController', () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  it('should return all authors', async () => {
    const response = await request(app).get('/api/v1/authors');
    expect(response.body.data.authors).toEqual([]);
  });

  test('get /authors with incorrect pagination fails', async () => {
    const response = await request(app).get('/api/v1/authors?page=0&limit=0').send();
    expect(response.status).toBe(400);
  });

  test('get /authors/:id/books with incorrect pagination fails', async () => {
    const author = await Author.create(authorsFixture[1]);
    const response = await request(app)
      .get(`/api/v1/authors/${author.id}/books?page=-1&limit=more`)
      .send();
    expect(response.status).toBe(400);
  });

  test('get existing author by name', async () => {
    const author = await Author.create(authorsFixture[1]);
    const response = await request(app).get(`/api/v1/authors/${author.id}`).send();
    expect(response.status).toBe(200);
    expect(response.body.data.name).toEqual(authorsFixture[1].name);
  });

  test('get books by existing author', async () => {
    const author = await Author.create(authorsFixture[1]);
    const response = await request(app).get(`/api/v1/authors/${author.id}/books`).send();
    expect(response.status).toBe(200);
    expect(response.body.data.books).toEqual([]);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('authorsController protected routes – user', () => {
  let mongoHelper: MongoHelper;
  let token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken } = await createUser();
    await Author.create(authorsFixture[1]);
    token = accessToken;
  });

  it('should not allow to create a author', async () => {
    const response = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send(authorsFixture[1]);
    expect(response.status).toBe(403);
  });

  it('should not allow to update a book by ID', async () => {
    const response = await request(app)
      .put(`/api/v1/authors/${authorsFixture[1]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...authorsFixture[1], name: 'Lev Tolstoy' });
    expect(response.status).toBe(403);
  });

  it('should not allow to delete a author by ID', async () => {
    const response = await request(app)
      .delete(`/api/v1/authors/${authorsFixture[1]}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('authorsController protected routes – admin', () => {
  let mongoHelper: MongoHelper;
  let token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken } = await createAdmin();
    token = accessToken;
  });

  it('creates a  new author', async () => {
    const response = await request(app)
      .post('/api/v1/authors')
      .set('Authorization', `Bearer ${token}`)
      .send(authorsFixture[1]);
    expect(response.status).toBe(201);
  });

  it('updates existing author by ID', async () => {
    const author = await Author.create(authorsFixture[1]);
    const response = await request(app)
      .put(`/api/v1/authors/${author.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...authorsFixture[1],
        name: 'Lev Tolstoy',
      });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Lev Tolstoy');
  });

  it('fails to update non-existing author by ID', async () => {
    const author = await Author.create(authorsFixture[1]);
    const response = await request(app)
      .put(`/api/v1/authors/${author.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...authorsFixture[1], name: 1234 });
    expect(response.status).toBe(400);
  });

  it('delete a author by ID', async () => {
    const author = await Author.create(authorsFixture[1]);
    const response = await request(app)
      .delete(`/api/v1/authors/${author.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('fails to delete non-existing author by ID', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/v1/authors/${nonExistingId.toString()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
