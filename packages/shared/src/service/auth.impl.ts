import { hash, verify } from '@node-rs/argon2';
import {
  LoginUser,
  RegisterUser,
  AuthService,
  UserValidationError,
} from '#dep/service/auth';
import { lucia } from '../auth';
import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type { UserRepository } from '../repository';
import type { OtpService } from './otp';

@injectable()
export class AuthServiceImpl implements AuthService {
  private _userRepository: UserRepository;
  private _otpService: OtpService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.OtpService) otpService: OtpService
  ) {
    this._userRepository = userRepository;
    this._otpService = otpService;
  }

  async registerUser(data: RegisterUser) {
    const hashed_password = await hash(data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const existingPhoneNumber =
      await this._userRepository.findUserByPhoneNumber(data.phoneNumber);

    if (existingPhoneNumber) {
      return {
        error: new UserValidationError({
          phoneNumber: 'Phone number already exists',
        }),
      };
    }

    const existingEmail = await this._userRepository.findUserByEmail(
      data.email
    );

    if (existingEmail) {
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

    const sendOtp = await this._otpService.sendOtp(insertedId);

    if (sendOtp.error) {
      return {
        error: sendOtp.error,
      };
    }

    const session = await lucia.createSession(insertedId, {
      userId: insertedId,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    return {
      result: sessionCookie,
    };
  }

  async loginUser(data: LoginUser) {
    try {
      const user = await this._userRepository.findUserByPhoneNumber(
        data.phoneNumber
      );

      if (!user) {
        return {
          error: new UserValidationError({
            phoneNumber: 'User not found',
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
        userId: user.id,
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
