import { TYPES } from '#dep/inversify/index';

import { hash, verify } from '@node-rs/argon2';
import { Cookie } from 'lucia';
import type { ErrorFields, PromiseResult } from '../types';
import { injectable } from 'inversify';
export interface RegisterUser {
  phoneNumber: string;
  password: string;
  name: string;
  email: string;
  address: string;
}

type ValidatedRegisterFields = keyof Partial<RegisterUser>;

export interface LoginUser {
  phoneNumber: string;
  password: string;
}

type ValidatedLoginFields = keyof Partial<LoginUser>;

type ValidatedFields = ValidatedRegisterFields | ValidatedLoginFields;
type ErrorResult = UserValidationError | Error;

export const test = 'test';

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
export interface UserService {
  registerUser(data: RegisterUser): PromiseResult<Cookie, ErrorResult>;
  loginUser(data: LoginUser): PromiseResult<Cookie, ErrorResult>;
}
