import { Request, Response } from 'express';
import UsersService from '../services/usersService';
import { Role, UserDto } from '../types/users';
import respondWith from '../utils/respondWith';
import { hideSensitiveData } from '../utils/hideSensitiveData';

async function getAllUsers(_req: Request, res: Response) {
  const users = await UsersService.findAll();
  respondWith(res, { code: 200, data: users });
}

async function getUserById(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const user = await UsersService.findOne(id);
  respondWith(res, { code: 200, data: hideSensitiveData(user) });
}

async function updateUserById(req: Request<{ id: string }, unknown, UserDto>, res: Response) {
  const { id } = req.params;
  const userDto = req.body;
  const updatedUser = await UsersService.updateOne(id, userDto);
  respondWith(res, { code: 200, data: hideSensitiveData(updatedUser) });
}

async function deleteUserById(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  await UsersService.deleteOne(id);
  res.status(204).end();
}

async function borrowBooks(req: Request<{ id: string }, string[]>, res: Response) {
  const { id } = req.params;
  const bookIds = req.body;
  const borrowedBooksIds = await UsersService.borrowBooks(id, bookIds);
  respondWith(res, { code: 200, data: { borrowedBooks: borrowedBooksIds } });
}

async function returnBooks(req: Request<{ id: string }, string[]>, res: Response) {
  const { id } = req.params;
  const bookIds = req.body;
  const returnedBooksIds = await UsersService.returnBooks(id, bookIds);
  respondWith(res, { code: 200, data: { returnedBooks: returnedBooksIds } });
}

async function changeRole(req: Request<{ id: string }, { role: Role }>, res: Response) {
  const { id } = req.params;
  const { role } = req.body;
  const updatedUser = await UsersService.changeRole(id, role);
  respondWith(res, { code: 200, data: hideSensitiveData(updatedUser) });
}

export default {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  borrowBooks,
  returnBooks,
  changeRole,
};
