import type { OtpRepository } from '#dep/repository/otp';
import { Users } from '../db';
import { TYPES } from '../inversify';
import type { NotificationService } from '../notification';
import type { SelectUser, UserRepository } from '../repository';
import { OtpService, SendOtp, VerifyOtp } from './otp';
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

  async send(data: SendOtp) {
    const user = await this._userRepository.findById(data.userId);

    if (!user) {
      return {
        error: new Error('Akun belum terdaftar'),
      };
    }

    await this._otpRepository.deleteByUserId(data.userId);

    // generate 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // insert otp into otp table
    const inserted = await this._otpRepository.create({
      user_id: data.userId,
      otp,
      expired_at: new Date(Date.now() + 1 * 60 * 1000),
    });

    if (!inserted) {
      return {
        error: new Error('Failed to insert otp'),
      };
    }

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

  async verify(data: VerifyOtp) {
    const otp = await this._otpRepository.findByUserId(data.userId);

    if (!otp) {
      return {
        error: new Error('OTP yang anda masukkan salah'),
      };
    }

    if (otp.otp !== data.otp) {
      return {
        error: new Error('OTP yang anda masukkan salah'),
      };
    }

    if (otp.expired_at < new Date()) {
      return {
        error: new Error('OTP sudah kadaluarsa'),
      };
    }

    const updateUser = await this._userRepository.update({
      id: data.userId,
      verified_at: new Date(),
    });

    if (updateUser) {
      return {
        error: updateUser,
      };
    }

    const deleteOtp = await this._otpRepository.deleteByUserId(data.userId);

    if (deleteOtp) {
      return {
        error: deleteOtp,
      };
    }

    return {
      result: true,
    };
  }
}
