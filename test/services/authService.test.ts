import connect, { MongoHelper } from '../dbHelper';
import usersFixture from '../__fixtures__/users';
import authService from '../../services/authService';

describe('authService', () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  test('create a user', async () => {
    const result = await authService.signup(usersFixture[0]);
    expect(result.accessToken).toBeDefined();
  });

  test('login as user', async () => {
    const { email, password } = usersFixture[0];
    const loginAsUser = await authService.login({ email, password });
    expect(loginAsUser.accessToken).toBeDefined();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
