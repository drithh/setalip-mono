import type { OtpRepository } from '#dep/repository/otp';
import { Users } from '../db';
import { TYPES } from '../inversify';
import type { NotificationService } from '../notification';
import type { SelectUser, UserRepository } from '../repository';
import { OtpService, VerifyOtp } from './otp';
import { inject, injectable } from 'inversify';

@injectable()
export class OtpServiceImpl implements OtpService {
  private _otpRepository: OtpRepository;
  private _notificationService: NotificationService;
  private _userRepository: UserRepository;

  constructor(
    @inject(TYPES.OtpRepository) otpRepository: OtpRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService
  ) {
    this._otpRepository = otpRepository;
    this._notificationService = notificationService;
    this._userRepository = userRepository;
  }

  async sendOtp(userId: SelectUser['id']) {
    const user = await this._userRepository.findUserById(userId);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    await this._otpRepository.deleteOtpByUserId(userId);

    // generate 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // insert otp into otp table
    const inserted = await this._otpRepository.createOtp({
      user_id: userId,
      otp,
      expired_at: new Date(Date.now() + 1 * 60 * 1000),
    });

    if (!inserted) {
      return {
        error: new Error('Failed to insert otp'),
      };
    }

    console.log('phone_number', user.phone_number);

    const notification = await this._notificationService.sendNotification({
      message: `Your otp is ${otp}`,
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
  async verifyOtp(data: VerifyOtp) {
    const otp = await this._otpRepository.findOtpByUserId(data.userId);

    if (!otp) {
      return {
        error: new Error('Otp not found'),
      };
    }

    if (otp.otp !== data.otp) {
      return {
        error: new Error('Invalid otp'),
      };
    }

    if (otp.expired_at < new Date()) {
      return {
        error: new Error('Otp expired'),
      };
    }

    return {
      result: true,
    };
  }
}