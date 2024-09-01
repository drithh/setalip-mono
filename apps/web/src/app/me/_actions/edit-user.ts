'use server';
import { container, TYPES } from '@repo/shared/inversify';
import { UserService } from '@repo/shared/service';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

import { validateRequest } from '@/lib/auth';

import { editUserSchema, FormEditUser } from '../form-schema';
import { parsePhoneNumber } from 'libphonenumber-js';
import { redirect } from 'next/navigation';

export async function editUser(
  state: FormEditUser,
  data: FormData,
): Promise<FormEditUser> {
  const auth = await validateRequest();

  if (!auth) {
    redirect('/login');
  }

  if (!auth.user || !auth.session) {
    redirect('/login');
  }

  const formData = convertFormData(data);
  const parsed = editUserSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const userService = container.get<UserService>(TYPES.UserService);

  const user = await userService.findById(parsed.data.id);

  if (user.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: user.error.message,
    };
  }

  if (user.result === undefined) {
    return {
      form: parsed.data,
      status: 'error',
      errors: 'User not found',
    };
  }

  if (user.result.id !== auth.user.id) {
    return {
      form: parsed.data,
      status: 'error',
      errors: 'User not found',
    };
  }

  const parsedPhoneNumber = parsePhoneNumber(parsed.data.phone_number);
  const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  const result = await userService.update({
    id: parsed.data.id,
    name: parsed.data.name,
    email: parsed.data.email,
    phone_number: formattedPhoneNumber,
    address: parsed.data.address,
    location_id: parsed.data.location_id !== 0 ? parsed.data.location_id : null,
  });

  if (result.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: result.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
