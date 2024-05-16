import { hash, verify } from '@node-rs/argon2';
import {
  LoginUser,
  RegisterUser,
  AuthService,
  UserValidationError,
  ResetPassword,
} from '#dep/service/auth';
import { lucia } from '../auth';
import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type { UserRepository } from '../repository';
import type { OtpService } from './otp';
import type { ResetPasswordRepository } from '#dep/repository/resetPassword';
import type { ResetPasswordService } from './resetPassword';

@injectable()
export class AuthServiceImpl implements AuthService {
  private _userRepository: UserRepository;
  private _otpService: OtpService;
  private _resetPasswordService: ResetPasswordService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.OtpService) otpService: OtpService,
    @inject(TYPES.ResetPasswordService)
    resetPasswordService: ResetPasswordService
  ) {
    this._userRepository = userRepository;
    this._otpService = otpService;
    this._resetPasswordService = resetPasswordService;
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

    const sendOtp = await this._otpService.sendOtp({ userId: insertedId });

    if (sendOtp.error) {
      return {
        error: sendOtp.error,
      };
    }

    const session = await lucia.createSession(insertedId, {});
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

      const session = await lucia.createSession(user.id, {});
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

  async forgotPassword(data: { phoneNumber: string }) {
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

    return {
      result: 'OTP sent',
    };
  }

  async resetPassword(data: ResetPassword) {
    const resetPassword = await this._resetPasswordService.verifyResetPassword({
      token: data.token,
    });

    if (resetPassword.error) {
      return {
        error: resetPassword.error,
      };
    }
    const hashed_password = await hash(data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const updated = await this._userRepository.updateUser({
      id: resetPassword.result,
      hashed_password,
    });

    if (!updated) {
      return {
        error: new UserValidationError({
          password: 'Could not update password',
        }),
      };
    }

    return {
      result: 'Password updated',
    };
  }
}
