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
import { api } from '@/trpc/server';

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

  const fileUpload =
    parsed.data.file?.size && parsed.data.file?.size > 0
      ? await api.file.uploadLocal({ files: parsed.data.file })
      : [{ url: parsed.data.image_url ?? '', name: 'logo' }];

  if (fileUpload.length === 0) {
    return {
      form: parsed.data,
      status: 'field-errors',
      errors: {
        file: {
          type: 'required',
          message: 'File is required',
        },
      },
    };
  }

  const packageService = container.get<PackageService>(TYPES.PackageService);

  const facility = await packageService.updatePackageTransactionImage({
    id: parsed.data.id ?? 0,
    image_url: fileUpload[0]?.url ?? null,
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
