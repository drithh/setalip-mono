import { inject, injectable } from 'inversify';
import { ResetPassword } from '../db';
import { PromiseResult } from '../types';
import {
  ResetPasswordService,
  SendResetPassword,
  VerifyResetPassword,
} from './reset-password';
import type { ResetPasswordRepository } from '#dep/repository/reset-password';
import { TYPES } from '../inversify';
import { UserValidationError } from './auth';
import { NotificationType, type NotificationService } from '../notification';
import type { SelectUser, UserRepository } from '../repository';
import { generateIdFromEntropySize } from 'lucia';
import { env } from '#dep/env';

@injectable()
export class ResetPasswordServiceImpl implements ResetPasswordService {
  private _resetPasswordRepository: ResetPasswordRepository;
  private _notificationService: NotificationService;
  private _userRepository: UserRepository;

  constructor(
    @inject(TYPES.ResetPasswordRepository)
    resetPasswordRepository: ResetPasswordRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService,
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this._resetPasswordRepository = resetPasswordRepository;
    this._notificationService = notificationService;
    this._userRepository = userRepository;
  }

  async send(data: SendResetPassword) {
    const user = await this._userRepository.findByPhoneNumber(data.phoneNumber);

    if (!user) {
      return {
        error: new Error('Akun belum terdaftar'),
      };
    }

    const token = generateIdFromEntropySize(32);

    const resetPassword = await this._resetPasswordRepository.create({
      user_id: user.id,
      token: token,
      expired_at: new Date(Date.now() + 60000),
    });

    if (!resetPassword) {
      return {
        error: new Error('Akun belum terdaftar'),
      };
    }

    // get host from header or anything else except env
    const host = data.referrerHost === 'admin' ? env.ADMIN_URL : env.WEB_URL;
    const resetPasswordLink = `${host}/reset-password/${token}`;

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.UserResetPassword,
        resetPasswordLink,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        error: notification.error,
      };
    }

    return {
      result: void {},
    };
  }
  async verify(data: VerifyResetPassword) {
    const resetPassword = await this._resetPasswordRepository.findByToken(
      data.token
    );

    if (!resetPassword) {
      return {
        error: new Error('Reset password not found'),
      };
    }

    if (resetPassword.expired_at < new Date()) {
      return {
        error: new Error('Reset password expired'),
      };
    }

    const deleteResetPassword = await this._resetPasswordRepository.delete(
      resetPassword.id
    );

    if (deleteResetPassword) {
      return {
        error: deleteResetPassword,
      };
    }

    return {
      result: resetPassword['user_id'],
    };
  }
}
