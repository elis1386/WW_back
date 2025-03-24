import { z } from 'zod';
import { UserDtoSchema } from '../schemas/user';
import { JwtPayload } from 'jsonwebtoken';
import { ROLEVALUES } from '../common/auth';
import { Request } from 'express';
import { Document } from 'mongoose';

export type UserType = Document & {
  role: Role;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type UserDto = z.infer<typeof UserDtoSchema>;
export type JwtPayloadType = JwtPayload & { userId: string };

export const role = ROLEVALUES;
export type Role = keyof typeof role;

export interface WithAuthRequest extends Request {
  user?: UserType;
}
