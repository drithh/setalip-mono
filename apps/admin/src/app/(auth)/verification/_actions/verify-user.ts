'use server';
import { OtpService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { VerifyOtpSchema, verifyOtpSchema } from '../form-schema';
import { UserRepository } from '@repo/shared/repository';

export async function verifyUser(
  state: FormState<VerifyOtpSchema>,
  data: FormData,
): Promise<FormState<VerifyOtpSchema>> {
  const formData = Object.fromEntries(data);
  const parsed = verifyOtpSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      form: {
        userId: state.form.userId,
        otp: data.get('otp') as string,
      },
      status: 'field-errors',
      errors: {
        otp: {
          type: 'required',
          message: 'OTP is required',
        },
      },
    };
  }

  const otpService = container.get<OtpService>(TYPES.OtpService);

  const otpResult = await otpService.verifyOtp({
    userId: state.form.userId,
    otp: parsed.data.otp,
  });
  if (otpResult.error) {
    return {
      form: {
        userId: state.form.userId,
        otp: parsed.data.otp,
      },
      status: 'error',
      errors: otpResult.error.message,
    };
  }

  return {
    form: {
      userId: state.form.userId,
      otp: parsed.data.otp,
    },
    status: 'success',
  };
}
