import mongoose from 'mongoose';
import { UserType, role } from '../types/users';
import _ from 'lodash';

const UserSchema = new mongoose.Schema<UserType>({
  role: {
    type: String,
    enum: [role.USER, role.ADMIN],
    default: role.USER,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
});

UserSchema.virtual('borrowedBooks', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'borrowerId',
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    return _.omit(ret, 'id');
  },
});

UserSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    return _.omit(ret, 'id');
  },
});

const UserModel = mongoose.model<UserType>('User', UserSchema);

export default UserModel;
