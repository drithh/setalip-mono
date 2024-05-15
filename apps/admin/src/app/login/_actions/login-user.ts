'use server';
import { cookies } from 'next/headers';
import { AuthService, UserValidationError } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { loginUserSchema, LoginUserSchema } from '../form-schema';
import { convertErrorsToZod } from '@repo/shared/util';
import { NotificationService } from '@repo/shared/notification';
import { UserRepository } from '@repo/shared/repository';
import { isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export async function signin(
  state: FormState<LoginUserSchema>,
  data: FormData
): Promise<FormState<LoginUserSchema>> {
  const formData = Object.fromEntries(data);
  const parsed = loginUserSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: {
        phoneNumber: data.get('phoneNumber') as string,
        password: data.get('password') as string,
      },
      status: 'field-errors',
      errors: {
        phoneNumber: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.phoneNumber?.at(0),
        },
        password: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.password?.at(0),
        },
      },
    };
  }

  const parsedPhoneNumber = parsePhoneNumber(parsed.data.phoneNumber);
  const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  const AuthService = container.get<AuthService>(TYPES.AuthService);
  const loginUser = await AuthService.loginUser({
    ...parsed.data,
    phoneNumber: formattedPhoneNumber,
  });
  console.log(loginUser);

  if (loginUser.error instanceof UserValidationError) {
    const errors = loginUser.error.getErrors();

    const mappedErrors = convertErrorsToZod<LoginUserSchema>(errors);

    return {
      form: {
        ...parsed.data,
      },
      status: 'field-errors',
      errors: mappedErrors,
    };
  } else if (loginUser.error) {
    return {
      form: {
        ...parsed.data,
      },
      status: 'error',
      errors: loginUser.error.message,
    };
  }

  cookies().set(
    loginUser.result.name,
    loginUser.result.value,
    loginUser.result.attributes
  );

  return {
    form: {
      phoneNumber: '',
      password: '',
    },
    status: 'success',
  };
}
