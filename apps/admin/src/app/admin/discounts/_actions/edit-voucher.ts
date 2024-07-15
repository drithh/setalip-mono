'use server';
import { VoucherService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editVoucherSchema, FormEditVoucher } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function editVoucher(
  state: FormEditVoucher,
  data: FormData,
): Promise<FormEditVoucher> {
  const formData = convertFormData(data);
  const parsed = editVoucherSchema.safeParse(formData);

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

  const result = await voucherService.update({
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
