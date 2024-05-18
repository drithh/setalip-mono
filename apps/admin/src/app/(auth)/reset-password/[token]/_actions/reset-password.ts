'use server';

import {
  AuthService,
  ResetPasswordService,
  UserValidationError,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { resetPasswordSchema, ResetPasswordSchema } from '../form-schema';

export async function resetPassword(
  state: FormState<ResetPasswordSchema>,
  data: FormData,
): Promise<FormState<ResetPasswordSchema>> {
  const formData = Object.fromEntries(data);
  const parsed = resetPasswordSchema.safeParse(formData);
  console.log('formData', parsed);
  if (!parsed.success) {
    return {
      form: {
        token: state.form.token,
        password: data.get('password') as string,
        passwordConfirmation: data.get('passwordConfirmation') as string,
      },
      status: 'field-errors',
      errors: {
        password: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.password?.at(0),
        },
        passwordConfirmation: {
          type: 'required',
          message:
            parsed.error.formErrors.fieldErrors.passwordConfirmation?.at(0),
        },
      },
    };
  }

  const resetPasswordService = container.get<ResetPasswordService>(
    TYPES.ResetPasswordService,
  );

  const resetPassword = await resetPasswordService.verifyResetPassword({
    token: state.form.token,
  });

  if (resetPassword.error) {
    return {
      form: {
        token: state.form.token,
        password: parsed.data.password,
        passwordConfirmation: parsed.data.passwordConfirmation,
      },
      status: 'error',
      errors: resetPassword.error.message,
    };
  }

  return {
    form: {
      token: state.form.token,
      password: parsed.data.password,
      passwordConfirmation: parsed.data.passwordConfirmation,
    },
    status: 'success',
  };
}
