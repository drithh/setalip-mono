'use server';

import { ResetPasswordService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { forgotPasswordSchema, FormForgotPassword } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';

export async function forgotPassword(
  state: FormForgotPassword,
  data: FormData,
): Promise<FormForgotPassword> {
  const formData = convertFormData(data);
  const parsed = forgotPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const parsedPhoneNumber = parsePhoneNumber(parsed.data.phoneNumber);
  const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  const resetPasswordService = container.get<ResetPasswordService>(
    TYPES.ResetPasswordService,
  );

  const resetPassword = await resetPasswordService.send({
    phoneNumber: formattedPhoneNumber,
    referrerHost: 'admin',
  });

  if (resetPassword.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: resetPassword.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
