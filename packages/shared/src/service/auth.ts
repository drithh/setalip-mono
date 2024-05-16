import { Cookie } from 'lucia';
import type { ErrorFields, PromiseResult } from '../types';
export interface RegisterUser {
  phoneNumber: string;
  password: string;
  name: string;
  email: string;
  address: string;
}

export interface LoginUser {
  phoneNumber: string;
  password: string;
}

type ValidatedFields = keyof Partial<RegisterUser> | keyof Partial<LoginUser>;

type ErrorResult = UserValidationError | Error;

export class UserValidationError extends Error {
  private errors: ErrorFields<ValidatedFields>;

  constructor(errors: ErrorFields<ValidatedFields>) {
    super(`User validation error: ${JSON.stringify(errors)}`);
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}
export interface AuthService {
  registerUser(data: RegisterUser): PromiseResult<Cookie, ErrorResult>;
  loginUser(data: LoginUser): PromiseResult<Cookie, ErrorResult>;
  forgotPassword(data: {
    phoneNumber: string;
  }): PromiseResult<string, ErrorResult>;
}
