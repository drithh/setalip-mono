'use server';

import { container, TYPES } from '@repo/shared/inversify';
import { AuthService } from '@repo/shared/service';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

import { FormResetPassword, resetPasswordSchema } from '../form-schema';

export async function resetPassword(
  state: FormResetPassword,
  data: FormData,
): Promise<FormResetPassword> {
  const formData = convertFormData(data);
  const parsed = resetPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const authService = container.get<AuthService>(TYPES.AuthService);

  const resetPassword = await authService.resetPassword({
    token: state.form?.token || parsed.data.token,
    password: parsed.data.password,
    passwordConfirmation: parsed.data.passwordConfirmation,
  });

  if (resetPassword.error) {
    return {
      form: {
        token: state.form?.token || parsed.data.token,
        password: parsed.data.password,
        passwordConfirmation: parsed.data.passwordConfirmation,
      },
      status: 'error',
      errors: resetPassword.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
