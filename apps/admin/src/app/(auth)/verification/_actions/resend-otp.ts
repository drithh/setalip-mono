'use server';

import { ResendOtpSchema } from './../form-schema';
import { FormState } from '@repo/shared/form';
import { container, TYPES } from '@repo/shared/inversify';
import { OtpService } from '@repo/shared/service';

export async function resendOtp(
  state: FormState<ResendOtpSchema>,
  data: FormData
): Promise<FormState<ResendOtpSchema>> {
  const otpService = container.get<OtpService>(TYPES.OtpService);

  const otpResult = await otpService.sendOtp({ userId: state.form.userId });

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
