'use server';
import { LocationService } from '@repo/shared/service';
import {
  editFacilitySchema,
  FormEditFacility,
  FormUploadLocationAsset,
  UploadLocationAssetSchema,
  uploadLocationAssetSchema,
} from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { container, TYPES } from '@repo/shared/inversify';

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

  const formUpload = new FormData();
  if (Array.isArray(formData.files)) {
    formData.files.forEach((file) => {
      formUpload.append('file', file);
    });
  } else {
    formUpload.append('file', formData.files);
  }

  const imageUpload = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formUpload,
  });

  if (!imageUpload.ok) {
    return {
      form: state.form,
      status: 'error',
      errors: 'Failed to upload files',
    };
  }

  type Response = {
    url: string;
    name: string;
  }[];
  const image = (await imageUpload.json()) as Response;

  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locationAsset = await locationService.createLocationAsset(
    image.map((asset) => ({
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
