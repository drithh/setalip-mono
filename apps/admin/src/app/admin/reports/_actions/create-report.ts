'use server';
import { expenseSchema, FormExpense } from '../_components/form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function expense(
  state: FormExpense,
  data: FormData,
): Promise<FormExpense> {
  const formData = convertFormData(data);
  const parsed = expenseSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
