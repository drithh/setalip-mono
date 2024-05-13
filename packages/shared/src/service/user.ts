import { TYPES } from '#dep/inversify/index';

import type { UserRepository } from '#dep/repository/user';
import { inject, injectable } from 'inversify';
import { DeleteResult, InsertResult } from 'kysely';
import { lucia } from '#dep/auth/index';
import { Cookie } from 'lucia';
import { hash, verify } from '@node-rs/argon2';
import { ErrorFields, PromiseResult } from '.';

interface RegisterUser {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
}

type ValidatedRegisterFields = keyof Partial<RegisterUser>;

interface LoginUser {
  email: string;
  password: string;
}

type ValidatedLoginFields = keyof Partial<LoginUser>;

type ValidatedFields = ValidatedRegisterFields | ValidatedLoginFields;
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

export interface UserService {
  registerUser(data: RegisterUser): PromiseResult<Cookie, ErrorResult>;
  loginUser(data: LoginUser): PromiseResult<Cookie, ErrorResult>;
}

@injectable()
export class UserServiceImpl implements UserService {
  private _userRepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  async registerUser(data: RegisterUser) {
    const hashed_password = await hash(data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const existingUser = await this._userRepository.findUserByEmail(data.email);

    if (existingUser) {
      return {
        error: new UserValidationError({
          email: 'Email already exists',
        }),
      };
    }

    const inserted = await this._userRepository.createUser({
      email: data.email,
      name: data.name,
      phone_number: data.phoneNumber,
      address: data.address,
      role: 'user',
      hashed_password,
      location_id: 1,
    });

    if (!inserted) {
      return {
        error: new UserValidationError({
          email: 'Could not create user',
        }),
      };
    }

    const insertedId = Number(inserted.insertId);
    const session = await lucia.createSession(insertedId, {
      user_id: insertedId,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    return {
      result: sessionCookie,
    };
  }

  async loginUser(data: LoginUser) {
    try {
      const user = await this._userRepository.findUserByEmail(data.email);

      if (!user) {
        return {
          error: new UserValidationError({
            email: 'User not found',
          }),
        };
      }

      const valid = await verify(user.hashed_password, data.password);

      if (!valid) {
        return {
          error: new UserValidationError({
            password: 'Invalid password',
          }),
        };
      }

      const session = await lucia.createSession(user.id, {
        user_id: user.id,
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      return {
        result: sessionCookie,
      };
    } catch (error) {
      return {
        error: new Error(String(error)),
      };
    }
  }
}
