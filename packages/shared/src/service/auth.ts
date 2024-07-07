import { Cookie } from 'lucia';
import type { ErrorFields, PromiseResult } from '../types';
export interface RegisterUser {
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  email: string;
  address: string;
  location_id: number;
}

export interface LoginUser {
  phoneNumber: string;
  password: string;
}

export interface ResetPassword {
  token: string;
  password: string;
  passwordConfirmation: string;
}

type ValidatedFields =
  | keyof Partial<RegisterUser>
  | keyof Partial<LoginUser>
  | keyof Partial<ResetPassword>;

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
  register(data: RegisterUser): PromiseResult<Cookie, ErrorResult>;
  login(data: LoginUser): PromiseResult<Cookie, ErrorResult>;
  forgotPassword(data: {
    phoneNumber: string;
  }): PromiseResult<string, ErrorResult>;
  resetPassword(data: ResetPassword): PromiseResult<string, ErrorResult>;
}
