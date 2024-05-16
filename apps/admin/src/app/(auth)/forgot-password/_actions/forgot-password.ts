'use server';

import {
  AuthService,
  ResetPasswordService,
  UserValidationError,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { forgotPasswordSchema, ForgotPasswordSchema } from '../form-schema';
import { convertErrorsToZod } from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';

export async function signin(
  state: FormState<ForgotPasswordSchema>,
  data: FormData
): Promise<FormState<ForgotPasswordSchema>> {
  const formData = Object.fromEntries(data);
  const parsed = forgotPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: {
        phoneNumber: data.get('phoneNumber') as string,
      },
      status: 'field-errors',
      errors: {
        phoneNumber: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.phoneNumber?.at(0),
        },
      },
    };
  }

  const parsedPhoneNumber = parsePhoneNumber(parsed.data.phoneNumber);
  const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  const resetPasswordService = container.get<ResetPasswordService>(
    TYPES.ResetPasswordService
  );

  const resetPassword = await resetPasswordService.sendResetPassword({
    phoneNumber: formattedPhoneNumber,
  });

  if (resetPassword.error) {
    return {
      form: {
        phoneNumber: parsed.data.phoneNumber,
      },
      status: 'error',
      errors: resetPassword.error.message,
    };
  }

  return {
    form: {
      phoneNumber: '',
    },
    status: 'success',
  };
}
