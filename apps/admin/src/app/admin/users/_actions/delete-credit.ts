'use server';
import {
  CreditService,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { deleteCreditSchema, FormDeleteCredit } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { InsertCredit } from '@repo/shared/repository';

export async function deleteCredit(
  state: FormDeleteCredit,
  data: FormData,
): Promise<FormDeleteCredit> {
  const formData = convertFormData(data);
  const parsed = deleteCreditSchema.safeParse(formData);

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
    type: 'credit' as const,
  } satisfies InsertCredit;

  const creditService = container.get<CreditService>(TYPES.CreditService);

  const deleteCredit = await creditService.delete(insertData);

  if (deleteCredit.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: deleteCredit.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
