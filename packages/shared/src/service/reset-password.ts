import { ResetPassword } from '../db';
import { SelectUser } from '../repository';
import { PromiseResult } from '../types';

export interface VerifyResetPassword {
  token: ResetPassword['token'];
}

export interface SendResetPassword {
  phoneNumber: SelectUser['phone_number'];
  referrerHost: 'admin' | 'web';
}

export interface ResetPasswordService {
  send(data: SendResetPassword): PromiseResult<void, Error>;
  verify(data: VerifyResetPassword): PromiseResult<SelectUser['id'], Error>;
}
