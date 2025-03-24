import admins from './admins';
import authService from '../../services/authService';

export async function createAdmin() {
  const adminData = admins[0]

  const { accessToken, user } = await authService.signup(adminData);
  return { accessToken, user };
}
