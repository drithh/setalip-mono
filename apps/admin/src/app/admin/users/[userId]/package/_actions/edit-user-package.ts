'use server';
import { PackageService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  editPackageTransactionSchema,
  editUserPackageSchema,
  FormEditPackageTransaction,
  FormEditUserPackage,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function editUserPackage(
  state: FormEditUserPackage,
  data: FormData,
): Promise<FormEditUserPackage> {
  const formData = convertFormData(data);
  const parsed = editUserPackageSchema.safeParse(formData);

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

  const facility = await packageService.updateUserPackage({
    id: parsed.data.id ?? 0,
    expired_at: parsed.data.expired_at,
    credit: parsed.data.credit,
    credit_used: parsed.data.credit_used,
  });

  if (facility.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: facility.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
