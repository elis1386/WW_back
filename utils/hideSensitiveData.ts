import _ from 'lodash';
import { UserType } from '../types/users';

export function hideSensitiveData(user: UserType) {
  return _.omit(user.toObject(), ['password']);
}
