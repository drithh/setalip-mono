import { Users } from '../db';
import { SelectUser } from '../repository';
import { PromiseResult } from '../types';

export interface VerifyOtp {
  userId: SelectUser['id'];
  otp: string;
}

export interface OtpService {
  sendOtp(userId: SelectUser['id']): PromiseResult<void, Error>;
  verifyOtp(data: VerifyOtp): PromiseResult<boolean, Error>;
}
