import { PromiseResult } from '../types';
import { SelectOtp } from '#dep/repository/otp';

export interface VerifyOtp {
  userId: SelectOtp['user_id'];
  otp: SelectOtp['otp'];
}

export interface OtpService {
  sendOtp({
    userId,
  }: {
    userId: SelectOtp['user_id'];
  }): PromiseResult<void, Error>;
  verifyOtp(data: VerifyOtp): PromiseResult<boolean, Error>;
}
