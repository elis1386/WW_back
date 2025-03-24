import request from 'supertest';
import connect, { MongoHelper } from '../dbHelper';
import app from '../..';
import userFixtures from '../__fixtures__/users';
import { createUser } from '../__fixtures__/createUser';
import { UserType } from '../../types/users';

describe('authController', () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;
  let user: UserType;

  beforeAll(async () => {
    mongoHelper = await connect();
    const { accessToken: token, user: account } = await createUser();
    accessToken = token;
    user = account;
  });

  test('signup', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send(userFixtures[1]);
    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toBeDefined();
  });

  test('login', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'user@user.com',
      password: 'useruseruser',
    });
    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
  });

  test('fails to register a user with an existing email address', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send(userFixtures[1]);
    expect(response.status).toBe(400);
  });

  test('fails to log in with incorrect credentials', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'user@user.comMM',
      password: 'useruseruser',
    });
    expect(response.status).toBe(403);
  });

  test('get /me returns user data', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(user.id);
  });

  test('change password fails with incorrect old password', async () => {
    const initialPassword = userFixtures[0].password;
    const newPassword = `${initialPassword}1`;
    const response = await request(app).post(`/api/v1/auth/change-password`).send({
      oldPassword: newPassword,
      newPassword,
    });
    expect(response.status).toBe(403);
  });

  test('change password', async () => {
    const initialPassword = userFixtures[0].password;
    const newPassword = `${initialPassword}-1`;
    const response = await request(app)
      .post(`/api/v1/auth/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: initialPassword,
        newPassword,
      });
    expect(response.status).toBe(200);
    const failedLogin = await request(app)
      .post('/api/v1/auth/login')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: userFixtures[0].email,
        password: initialPassword,
      });
    expect(failedLogin.status).toBe(403);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
