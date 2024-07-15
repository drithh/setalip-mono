'use server';
import { VoucherService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createVoucherSchema, FormCreateVoucher } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function createVoucher(
  state: FormCreateVoucher,
  data: FormData,
): Promise<FormCreateVoucher> {
  const formData = convertFormData(data);
  const parsed = createVoucherSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const voucherService = container.get<VoucherService>(TYPES.VoucherService);

  const result = await voucherService.create({
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
