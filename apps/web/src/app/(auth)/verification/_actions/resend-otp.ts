'use server';

import { container, TYPES } from '@repo/shared/inversify';
import { OtpService } from '@repo/shared/service';

import { FormResendOtp } from '../form-schema';

export async function resendOtp(
  state: FormResendOtp,
  data: FormData,
): Promise<FormResendOtp> {
  const otpService = container.get<OtpService>(TYPES.OtpService);

  if (!state.form?.userId) {
    return {
      form: {
        userId: state.form?.userId,
      },
      status: 'field-errors',
      errors: {
        userId: {
          type: 'required',
          message: 'User ID is required',
        },
      },
    };
  }

  const otpResult = await otpService.send({ userId: state.form.userId });

  if (otpResult.error) {
    return {
      form: {
        userId: state.form.userId,
      },
      status: 'error',
      errors: otpResult.error.message,
    };
  }

  return {
    form: {
      userId: state.form.userId,
    },
    status: 'success',
  };
}
