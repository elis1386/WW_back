import authService from '../../services/authService';
import users from './users';

export async function createUser() {
  const userData = users[0];
  const { accessToken, user } = await authService.signup(userData);
  return { accessToken, user };
}
