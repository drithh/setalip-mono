'use server';
import { StatisticService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editSchema, FormEdit } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function edit(state: FormEdit, data: FormData): Promise<FormEdit> {
  const formData = convertFormData(data);
  const parsed = editSchema.safeParse(formData);

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

  const result = await statisticService.update({
    id: parsed.data.id,
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
