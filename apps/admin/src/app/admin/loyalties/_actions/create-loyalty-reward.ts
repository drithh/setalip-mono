'use server';
import { LoyaltyService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  createLoyaltyRewardSchema,
  FormCreateLoyaltyReward,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function createLoyaltyReward(
  state: FormCreateLoyaltyReward,
  data: FormData,
): Promise<FormCreateLoyaltyReward> {
  const formData = convertFormData(data);
  const parsed = createLoyaltyRewardSchema.safeParse(formData);

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

  const result = await loyaltyService.createReward({
    ...parsed.data,
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
