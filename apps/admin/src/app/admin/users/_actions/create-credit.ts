'use server';
import { CreditService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createCreditSchema, FormCreateCredit } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
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

  // const insertData = {
  //   ...parsed.data,
  //   type: 'debit' as const,
  // } satisfies InsertCredit;

  // const creditService = container.get<CreditService>(TYPES.CreditService);

  // const createCredit = await creditService.create(insertData);

  // if (createCredit.error) {
  //   return {
  //     form: parsed.data,
  //     status: 'error',
  //     errors: createCredit.error.message,
  //   };
  // }

  return {
    form: parsed.data,
    status: 'error',
    errors: 'Not implemented',
  };
  return {
    form: undefined,
    status: 'success',
  };
}
