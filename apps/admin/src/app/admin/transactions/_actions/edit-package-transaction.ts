'use server';
import { PackageService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  editPackageTransactionSchema,
  FormEditPackageTransaction,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { SelectPackageTransaction } from '@repo/shared/repository';

export async function editPackageTransaction(
  state: FormEditPackageTransaction,
  data: FormData,
): Promise<FormEditPackageTransaction> {
  const formData = convertFormData(data);
  const parsed = editPackageTransactionSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const packageService = container.get<PackageService>(TYPES.PackageService);

  const currentPackageTransaction =
    await packageService.findPackageTransactionById(parsed.data.id);

  const result = await packageService.updatePackageTransaction({
    id: parsed.data.id,
    status: parsed.data.status as SelectPackageTransaction['status'],

    amount_paid: null,
    voucher_discount: null,
    discount: null,
    deposit_account_id: null,
    voucher_code: null,
    voucher_id: null,
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
