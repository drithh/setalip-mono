'use server';
import { StatisticService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createSchema, FormCreate } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function create(
  state: FormCreate,
  data: FormData,
): Promise<FormCreate> {
  const formData = convertFormData(data);
  const parsed = createSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const statisticService = container.get<StatisticService>(
    TYPES.StatisticService,
  );

  const result = await statisticService.create({
    name: parsed.data.name,
    point: parsed.data.point,
    role: parsed.data.role,
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
