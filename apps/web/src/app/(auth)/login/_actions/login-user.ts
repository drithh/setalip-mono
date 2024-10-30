'use server';
import { container, TYPES } from '@repo/shared/inversify';
import { AuthService, UserValidationError } from '@repo/shared/service';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';
import { cookies } from 'next/headers';

import {
  FormLoginUser,
  LoginUserSchema,
  loginUserSchema,
} from '../form-schema';

export async function loginUser(
  state: FormLoginUser,
  data: FormData,
): Promise<FormLoginUser> {
  const formData = convertFormData(data);
  const parsed = loginUserSchema.safeParse(formData);

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

  const AuthService = container.get<AuthService>(TYPES.AuthService);
  const loginUser = await AuthService.login({
    ...parsed.data,
    phoneNumber: formattedPhoneNumber,
  });

  if (loginUser.error instanceof UserValidationError) {
    const errors = loginUser.error.getErrors();

    const mappedErrors = convertErrorsToZod<LoginUserSchema>(errors);

    return {
      form: parsed.data,
      status: 'field-errors',
      errors: mappedErrors,
    };
  } else if (loginUser.error) {
    return {
      form: parsed.data,

      status: 'error',
      errors: loginUser.error.message,
    };
  }

  cookies().set(
    loginUser.result.name,
    loginUser.result.value,
    loginUser.result.attributes,
  );

  return {
    form: undefined,
    status: 'success',
  };
}
