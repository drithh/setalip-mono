'use server';
import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

import { validateUser } from '@/lib/auth';

import { createReviewSchema, FormCreateReview } from '../form-schema';

export async function createReview(
  state: FormCreateReview,
  data: FormData,
): Promise<FormCreateReview> {
  const { user } = await validateUser();
  const formData = convertFormData(data);
  const parsed = createReviewSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const result = await webSettingService.createReview({
    ...parsed.data,
    user_id: user.id,
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
