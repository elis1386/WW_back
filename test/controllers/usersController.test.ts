import request from 'supertest';
import { createAdmin } from '../__fixtures__/createAdmin';
import connect, { MongoHelper } from '../dbHelper';
import app from '../..';
import { createUser } from '../__fixtures__/createUser';
import usersFixture from '../__fixtures__/users';
import booksFixture from '../__fixtures__/books';
import { UserType } from '../../types/users';
import usersService from '../../services/usersService';
import booksService from '../../services/booksService';
import { ROLEVALUES } from '../../common/auth';
import { ApiError } from '../../errors/ApiError';

describe('usersController protected routes – admin', () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;
  let user: UserType;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken: adminToken } = await createAdmin();
    accessToken = adminToken;
    const { user: userAccount } = await createUser();
    user = userAccount;
  });

  test('get /users returns a list of users', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  test('get /users/:id returns a user', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
  });

  test('put /users/:id updates a user', async () => {
    const testName = 'testName';
    const response = await request(app)
      .put(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...usersFixture[0], firstName: testName });
    expect(response.status).toBe(200);
    expect(response.body.data.firstName).toBe(testName);
  });

  test('put /users/:id/role updates role', async () => {
    const response = await request(app)
      .put(`/api/v1/users/${user.id}/role`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ role: ROLEVALUES.ADMIN });
    expect(response.status).toBe(200);
    expect(response.body.data.role).toBe(ROLEVALUES.ADMIN);
  });

  test('delete /users/:id deletes a user', async () => {
    const userToDelete = await usersService.createOne(usersFixture[1]);
    const response = await request(app)
      .delete(`/api/v1/users/${userToDelete.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(204);
    let thrownError: unknown;
    try {
      await usersService.findOne(userToDelete.id);
    } catch (e) {
      thrownError = e;
    }
    expect(thrownError).toBeInstanceOf(ApiError);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('usersController protected routes – user', () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;
  let user: UserType;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken: userToken, user: userAccount } = await createUser();
    accessToken = userToken;
    user = userAccount;
  });

  test('get /users fails', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(403);
  });

  test('get /users/:id only allows to see own profile', async () => {
    const ownProfileResponse = await request(app)
      .get(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(ownProfileResponse.status).toBe(200);
    const anotherUser = await usersService.createOne(usersFixture[1]);
    const anotherProfileResponse = await request(app)
      .get(`/api/v1/users/${anotherUser.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(anotherProfileResponse.status).toBe(403);
  });

  test('put /users/:id only allows to update own profile', async () => {
    const testName = 'testName';
    const ownProfileResponse = await request(app)
      .put(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...usersFixture[0], firstName: testName });
    expect(ownProfileResponse.status).toBe(200);
    expect(ownProfileResponse.body.data.firstName).toBe(testName);
    const anotherUser = (await usersService.findOneByEmail(usersFixture[1].email)) as UserType;
    const anotherProfileResponse = await request(app)
      .put(`/api/v1/users/${anotherUser.id}`)
      .send({
        ...usersFixture[1],
        firstName: testName,
      });
    expect(anotherProfileResponse.status).toBe(403);
  });

  test('attempt to update role fails', async () => {
    const response = await request(app)
      .put(`/api/v1/users/${user.id}/role`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ role: ROLEVALUES.ADMIN });
    expect(response.status).toBe(403);
  });

  test('delete /users/:id only deletes own profile', async () => {
    const anotherUser = (await usersService.findOneByEmail(usersFixture[1].email)) as UserType;
    const anotherResponse = await request(app).delete(`/api/v1/users/${anotherUser.id}`);
    expect(anotherResponse.status).toBe(403);
    const ownResponse = await request(app)
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(ownResponse.status).toBe(204);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});

describe('borrowing and returning books', () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;
  let user: UserType;
  let bookId: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken: userToken, user: userAccount } = await createUser();
    accessToken = userToken;
    user = userAccount;
    const book = await booksService.createOne(booksFixture[0]);
    bookId = book.id;
  });

  test('borrowing books', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${user.id}/borrow`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send([bookId]);
    expect(response.status).toBe(200);
    expect(response.body.data.borrowedBooks).toHaveLength(1);
    expect(response.body.data.borrowedBooks[0]).toBe(bookId);
  });

  test('returning borrowed books', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${user.id}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send([bookId]);
    expect(response.status).toBe(200);
    expect(response.body.data.returnedBooks).toHaveLength(1);
    expect(response.body.data.returnedBooks[0]).toBe(bookId);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
