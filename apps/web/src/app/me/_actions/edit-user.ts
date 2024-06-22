'use server';
import { cookies } from 'next/headers';
import { ClassTypeService, UserService } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { editUserSchema, FormEditUser } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { getAuth } from '@/lib/get-auth';

export async function editUser(
  state: FormEditUser,
  data: FormData,
): Promise<FormEditUser> {
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

  const auth = await getAuth();

  if (!auth) {
    redirect('/login');
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

  if (user.result.id !== auth.id) {
    return {
      form: parsed.data,
      status: 'error',
      errors: 'User not found',
    };
  }

  const result = await userService.update({
    id: parsed.data.id,
    name: parsed.data.name,
    email: parsed.data.email,
    phone_number: parsed.data.phone_number,
    address: parsed.data.address,
    location_id: parsed.data.location_id,
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
