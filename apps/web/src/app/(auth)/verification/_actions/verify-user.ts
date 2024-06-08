'use server';
import { OtpService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import {
  FormVerifyOtp,
  VerifyOtpSchema,
  verifyOtpSchema,
} from '../form-schema';
import { UserRepository } from '@repo/shared/repository';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function verifyUser(
  state: FormVerifyOtp,
  data: FormData,
): Promise<FormVerifyOtp> {
  const formData = convertFormData(data);
  const newFormData = {
    ...formData,
    otp: formData.otp?.toString(),
  };

  const parsed = verifyOtpSchema.safeParse(newFormData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const otpService = container.get<OtpService>(TYPES.OtpService);

  const otpResult = await otpService.verify({
    userId: state.form?.userId || parsed.data.userId,
    otp: parsed.data.otp,
  });

  if (otpResult.error) {
    return {
      form: {
        userId: state.form?.userId || parsed.data.userId,
        otp: parsed.data.otp,
      },
      status: 'error',
      errors: otpResult.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
