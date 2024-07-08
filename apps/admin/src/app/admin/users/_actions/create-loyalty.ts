'use server';
import { cookies } from 'next/headers';
import {
  AuthService,
  ClassTypeService,
  LoyaltyService,
  UserValidationError,
} from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createLoyaltySchema, FormCreateLoyalty } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function createLoyalty(
  state: FormCreateLoyalty,
  data: FormData,
): Promise<FormCreateLoyalty> {
  const formData = convertFormData(data);
  const parsed = createLoyaltySchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);

  const result = await loyaltyService.create({
    ...parsed.data,
    type: 'debit',
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
