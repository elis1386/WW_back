import z from 'zod';
import {
  LoginCredentialsSchema,
  SignupCredentialsSchema,
  UpdatePasswordSchema,
} from '../schemas/auth';

export type LoginCredentialsType = z.infer<typeof LoginCredentialsSchema>;
export type SignupCredentialsType = z.infer<typeof SignupCredentialsSchema>;
export type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>;
