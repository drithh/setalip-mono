'use server';
import { LoyaltyService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { deleteLoyaltySchema, FormDeleteLoyalty } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function deleteLoyalty(
  state: FormDeleteLoyalty,
  data: FormData,
): Promise<FormDeleteLoyalty> {
  const formData = convertFormData(data);
  const parsed = deleteLoyaltySchema.safeParse(formData);

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

  // const result = await loyaltyService.delete({
  //   ...parsed.data,
  // });

  // if (result.error) {
  //   return {
  //     form: parsed.data,
  //     status: 'error',
  //     errors: result.error.message,
  //   };
  // }

  return {
    form: undefined,
    status: 'success',
  };
}
