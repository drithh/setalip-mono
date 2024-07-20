'use server';

import { ClassService } from '@repo/shared/service';
import {
  FormUploadClassAsset,
  UploadClassAssetSchema,
  uploadClassAssetSchema,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { container, TYPES } from '@repo/shared/inversify';
import { api } from '@/trpc/server';

export async function uploadClassAsset(
  state: FormUploadClassAsset,
  data: FormData,
): Promise<FormUploadClassAsset> {
  const formData = convertFormData<UploadClassAssetSchema>(data);
  const parsed = uploadClassAssetSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: {
        ...state.form,
      },
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const fileUpload = await api.file.upload({
    files: parsed.data.files,
  });

  const classService = container.get<ClassService>(TYPES.ClassService);

  const classAsset = await classService.createAsset(
    fileUpload.map((asset) => ({
      class_id: state.form?.classId ?? 0,
      url: asset.url,
      type: 'image',
      name: asset.name,
    })),
  );

  if (classAsset.error) {
    return {
      form: undefined,
      status: 'error',
      errors: classAsset.error.message,
    };
  }

  return {
    form: state.form,
    status: 'success',
  };
}
