'use server';
import { cookies } from 'next/headers';
import { AuthService, UserValidationError } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { schema } from '../form-schema';
import { convertErrorsToZod } from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';
export type FormSchema = z.infer<typeof schema>;

export async function signup(
  state: FormState<FormSchema>,
  data: FormData
): Promise<FormState<FormSchema>> {
  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: {
        phoneNumber: data.get('phoneNumber') as string,
        password: data.get('password') as string,
        passwordConfirmation: data.get('passwordConfirmation') as string,
        name: data.get('name') as string,
        email: data.get('email') as string,
        address: data.get('address') as string,
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
        passwordConfirmation: {
          type: 'required',
          message:
            parsed.error.formErrors.fieldErrors.passwordConfirmation?.at(0),
        },
        name: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.name?.at(0),
        },
        email: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.email?.at(0),
        },
        address: {
          type: 'required',
          message: parsed.error.formErrors.fieldErrors.address?.at(0),
        },
      },
    };
  }

  const parsedPhoneNumber = parsePhoneNumber(parsed.data.phoneNumber);
  const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  const AuthService = container.get<AuthService>(TYPES.AuthService);
  const registerUser = await AuthService.registerUser({
    ...parsed.data,
    phoneNumber: formattedPhoneNumber,
  });

  if (registerUser.error instanceof UserValidationError) {
    const errors = registerUser.error.getErrors();

    const mappedErrors = convertErrorsToZod<FormSchema>(errors);

    return {
      form: {
        ...parsed.data,
      },
      status: 'field-errors',
      errors: mappedErrors,
    };
  } else if (registerUser.error) {
    return {
      form: {
        ...parsed.data,
      },
      status: 'error',
      errors: registerUser.error.message,
    };
  }

  cookies().set(
    registerUser.result.name,
    registerUser.result.value,
    registerUser.result.attributes
  );

  return {
    form: {
      phoneNumber: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      email: '',
      address: '',
    },
    status: 'success',
  };
}
