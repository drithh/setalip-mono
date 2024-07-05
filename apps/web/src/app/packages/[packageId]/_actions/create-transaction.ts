'use server';
import { cookies } from 'next/headers';
import { ClassTypeService, PackageService } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createTransactionSchema, FormCreateTransaction } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { validateUser } from '@/lib/auth';

export async function createTransaction(
  state: FormCreateTransaction,
  data: FormData,
): Promise<FormCreateTransaction> {
  const auth = await validateUser();

  const formData = convertFormData(data);
  const parsed = createTransactionSchema.safeParse(formData);

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

  const voucher = 0;

  if (parsed.data.id) {
    const result = await packageService.updatePackageTransaction({
      id: parsed.data.id,
      status: 'pending',
      deposit_account_id: parsed.data.deposit_account_id,
    });

    if (result.error) {
      return {
        form: parsed.data,
        status: 'error',
        errors: result.error.message,
      };
    }
  } else {
    const result = await packageService.createPackageTransaction({
      user_id: auth.user.id,
      package_id: parsed.data.package_id,
      discount: 0,
      deposit_account_id: parsed.data.deposit_account_id,
      unique_code: parsed.data.unique_code,
    });

    if (result.error) {
      return {
        form: parsed.data,
        status: 'error',
        errors: result.error.message,
      };
    }
  }

  return {
    form: undefined,
    status: 'success',
  };
}
