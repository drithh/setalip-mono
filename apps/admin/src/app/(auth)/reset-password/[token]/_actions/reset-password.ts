'use server';

import {
  ResetPasswordService,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  FormResetPassword,
  resetPasswordSchema,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

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

  const resetPasswordService = container.get<ResetPasswordService>(
    TYPES.ResetPasswordService,
  );

  const resetPassword = await resetPasswordService.verify({
    token: state.form?.token || parsed.data.token,
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
