'use server';

import { LocationService } from '@repo/shared/service';
import {
  FormUploadLocationAsset,
  UploadLocationAssetSchema,
  uploadLocationAssetSchema,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { container, TYPES } from '@repo/shared/inversify';
import { api } from '@/trpc/server';

export async function uploadLocationAsset(
  state: FormUploadLocationAsset,
  data: FormData,
): Promise<FormUploadLocationAsset> {
  const formData = convertFormData<UploadLocationAssetSchema>(data);
  const parsed = uploadLocationAssetSchema.safeParse(formData);

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

  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locationAsset = await locationService.createAsset(
    fileUpload.map((asset) => ({
      location_id: state.form?.locationId ?? 0,
      url: asset.url,
      name: asset.name,
    })),
  );

  if (locationAsset.error) {
    return {
      form: undefined,
      status: 'error',
      errors: locationAsset.error.message,
    };
  }

  return {
    form: state.form,
    status: 'success',
  };
}
