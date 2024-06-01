'use server';
import { cookies } from 'next/headers';
import { ClassTypeService, UserService } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createCreditSchema, FormCreateCredit } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parse } from 'path';
import { InsertCredit } from '@repo/shared/repository';

export async function createCredit(
  state: FormCreateCredit,
  data: FormData,
): Promise<FormCreateCredit> {
  const formData = convertFormData(data);
  const parsed = createCreditSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const insertData = {
    ...parsed.data,
    type: 'debit' as const,
  } satisfies InsertCredit;

  const userService = container.get<UserService>(TYPES.UserService);

  const createCredit = await userService.createCredit(insertData);

  if (createCredit.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: createCredit.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
