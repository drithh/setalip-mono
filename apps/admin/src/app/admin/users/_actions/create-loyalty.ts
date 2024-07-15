'use server';
import {
  LoyaltyService,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createLoyaltySchema, FormCreateLoyalty } from '../form-schema';
import {
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
