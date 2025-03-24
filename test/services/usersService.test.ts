import mongoose from 'mongoose';
import usersService from '../../services/usersService';
import usersFixture from '../__fixtures__/users';
import connect, { MongoHelper } from '../dbHelper';
import { ApiError } from '../../errors/ApiError';
import { ROLEVALUES } from '../../common/auth';

describe('usersService', () => {
  let mongoHelper: MongoHelper;
  let userId: string;

  beforeAll(async () => {
    mongoHelper = await connect();
    const user = await usersService.createOne(usersFixture[0]);
    userId = user.id;
  });

  test('findAll', async () => {
    const users = await usersService.findAll();
    expect(users).toHaveLength(1);
  });

  test('findOne', async () => {
    const user = await usersService.findOne(userId);
    expect(user).toBeDefined();
  });

  test('updateOne fails on nonexsitent user', async () => {
    let thrownError: unknown;
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    try {
      await usersService.updateOne(nonExistentId, usersFixture[0]);
    } catch (e) {
      thrownError = e;
    }
    expect(thrownError).toBeInstanceOf(ApiError);
  });

  test('updateOne', async () => {
    const testName = 'test-name';
    const updatedUser = await usersService.updateOne(userId, {
      ...usersFixture[0],
      firstName: testName,
    });
    expect(updatedUser.firstName).toBe(testName);
  });

  test('deleteOne fails on nonexsitent user', async () => {
    let thrownError: unknown;
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    try {
      await usersService.deleteOne(nonExistentId);
    } catch (e) {
      thrownError = e;
    }
    expect(thrownError).toBeInstanceOf(ApiError);
  });

  test('changeRole fails on nonexsitent user', async () => {
    let thrownError: unknown;
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    try {
      await usersService.changeRole(nonExistentId, ROLEVALUES.ADMIN);
    } catch (e) {
      thrownError = e;
    }
    expect(thrownError).toBeInstanceOf(ApiError);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });
});
