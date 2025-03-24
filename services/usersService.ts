import { Role, UserDto, UserType } from '../types/users';
import UserModel from '../models/User';
import { ApiError } from '../errors/ApiError';
import Book from '../models/Book';
import _ from 'lodash';

const findAll = async () => {
  const users = await UserModel.find().select('-password');
  return users;
};

const findOne = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw ApiError.resourceNotFound('User not found');
  }
  return user;
};

const findOneByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

const createOne = async (userDto: UserDto) => {
  const user = await UserModel.create(userDto);
  return user;
};

const updateOne = async (id: string, userDto: UserDto) => {
  const protectedInput = _.omit(userDto, ['password', 'role']);
  const updatedUser = await UserModel.findByIdAndUpdate(id, protectedInput, {
    new: true,
  });

  if (!updatedUser) {
    throw ApiError.resourceNotFound('User not found');
  }
  return updatedUser;
};

const deleteOne = async (id: string) => {
  const deleteUser = await UserModel.findById(id);
  if (!deleteUser) {
    throw ApiError.resourceNotFound('User not found');
  }
  await deleteUser.deleteOne();
};

const borrowBooks = async (userId: string, bookIds: string[]) => {
  const user = await findOne(userId);
  const borrowedBooksIds = await Book.borrow(bookIds, user.id);
  return borrowedBooksIds;
};

const returnBooks = async (userId: string, bookIds: string[]) => {
  const user = await findOne(userId);
  const returnedBooksIds = await Book.return(bookIds, user.id);
  return returnedBooksIds;
};

const changeRole = async (userId: string, role: Role) => {
  const user = await findOne(userId);
  if (!user) {
    throw ApiError.resourceNotFound('User not found');
  }
  const updatedUser = await UserModel.findByIdAndUpdate(user.id, { role }, { new: true });
  return updatedUser as UserType;
};

export default {
  findAll,
  findOne,
  createOne,
  findOneByEmail,
  updateOne,
  deleteOne,
  borrowBooks,
  returnBooks,
  changeRole,
};
