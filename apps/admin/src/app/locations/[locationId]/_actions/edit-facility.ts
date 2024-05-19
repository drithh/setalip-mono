'use server';
import { cookies } from 'next/headers';
import { AuthService, UserValidationError } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { editFacilitySchema, FormEditFacility } from '../form-schema';
import { convertErrorsToZod } from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';
import { FieldError } from 'react-hook-form';

// name: data.get('name') as string,
// capacity: data.get('capacity') as string,
// level: data.get('level') as string,
// convert to functions
function convertFormData<T>(data: FormData) {
  const formData = Object.fromEntries(data);
  return formData as T;
}

function convertZodErrorsToFieldErrors<
  T extends Record<string, string[] | undefined>,
>(errors: T) {
  return Object.keys(errors).reduce(
    (acc, key) => {
      const field = key as string;
      const message = errors[field];
      return {
        ...acc,
        [field]: {
          type: 'required',
          message: message,
        },
      };
    },
    {} as Record<keyof T, FieldError>,
  );
}

export async function editFacility(
  state: FormEditFacility,
  data: FormData,
): Promise<FormEditFacility> {
  const formData = convertFormData(data);
  const parsed = editFacilitySchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  // const parsedPhoneNumber = parsePhoneNumber(parsed.data.phoneNumber);
  // const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  // const AuthService = container.get<AuthService>(TYPES.AuthService);
  // const loginUser = await AuthService.loginUser({
  //   ...parsed.data,
  //   phoneNumber: formattedPhoneNumber,
  // });
  // console.log(loginUser);

  // if (loginUser.error instanceof UserValidationError) {
  //   const errors = loginUser.error.getErrors();

  //   const mappedErrors = convertErrorsToZod<EditFacilitySchema>(errors);

  //   return {
  //     form: {
  //       ...parsed.data,
  //     },
  //     status: 'field-errors',
  //     errors: mappedErrors,
  //   };
  // } else if (loginUser.error) {
  //   return {
  //     form: {
  //       ...parsed.data,
  //     },
  //     status: 'error',
  //     errors: loginUser.error.message,
  //   };
  // }

  // cookies().set(
  //   loginUser.result.name,
  //   loginUser.result.value,
  //   loginUser.result.attributes,
  // );

  return {
    form: undefined,
    status: 'success',
  };
}
