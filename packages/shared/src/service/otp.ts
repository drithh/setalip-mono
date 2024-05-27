import { PromiseResult } from '../types';
import { SelectOtp } from '#dep/repository/otp';

export interface VerifyOtp {
  userId: SelectOtp['user_id'];
  otp: SelectOtp['otp'];
}

export interface SendOtp {
  userId: SelectOtp['user_id'];
}

export interface OtpService {
  send(data: SendOtp): PromiseResult<void, Error>;
  verify(data: VerifyOtp): PromiseResult<boolean, Error>;
}
