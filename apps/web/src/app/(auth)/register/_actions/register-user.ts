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
  FormRegisterUser,
  RegisterUserSchema,
  registerUserSchema,
} from '../form-schema';

export async function registerUser(
  state: FormRegisterUser,
  data: FormData,
): Promise<FormRegisterUser> {
  const formData = convertFormData(data);
  const parsed = registerUserSchema.safeParse(formData);

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
  const registerUser = await AuthService.register({
    ...parsed.data,
    location_id:
      parsed.data.location_id && parsed.data.location_id !== 0
        ? parsed.data.location_id
        : null,
    phoneNumber: formattedPhoneNumber,
  });

  if (registerUser.error instanceof UserValidationError) {
    const errors = registerUser.error.getErrors();

    const mappedErrors = convertErrorsToZod<RegisterUserSchema>(errors);

    return {
      form: parsed.data,
      status: 'field-errors',
      errors: mappedErrors,
    };
  } else if (registerUser.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: registerUser.error.message,
    };
  }

  cookies().set(
    registerUser.result.name,
    registerUser.result.value,
    registerUser.result.attributes,
  );

  return {
    form: undefined,
    status: 'success',
  };
}
