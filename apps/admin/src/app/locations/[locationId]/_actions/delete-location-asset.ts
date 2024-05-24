'use server';
import { LocationService } from '@repo/shared/service';
import {
  FormDeleteLocationAsset,
  DeleteLocationAssetSchema,
  deleteLocationAssetSchema,
} from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { container, TYPES } from '@repo/shared/inversify';

export async function deleteLocationAsset(
  state: FormDeleteLocationAsset,
  data: FormData,
): Promise<FormDeleteLocationAsset> {
  const formData = convertFormData<DeleteLocationAssetSchema>(data);
  const parsed = deleteLocationAssetSchema.safeParse(formData);

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

  const locationService = container.get<LocationService>(TYPES.LocationService);

  const deleteLocationAsset = await locationService.deleteLocationAsset(
    parsed.data.assetId,
  );

  if (deleteLocationAsset.error) {
    return {
      form: undefined,
      status: 'error',
      errors: deleteLocationAsset.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
