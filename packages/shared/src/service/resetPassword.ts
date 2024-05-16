import { ResetPassword } from '../db';
import { SelectUser } from '../repository';
import { PromiseResult } from '../types';

export interface VerifyResetPassword {
  userId: ResetPassword['user_id'];
  token: ResetPassword['token'];
}

export interface ResetPasswordService {
  sendResetPassword({
    phoneNumber,
  }: {
    phoneNumber: SelectUser['phone_number'];
  }): PromiseResult<void, Error>;
  verifyResetPassword(data: VerifyResetPassword): PromiseResult<boolean, Error>;
}
