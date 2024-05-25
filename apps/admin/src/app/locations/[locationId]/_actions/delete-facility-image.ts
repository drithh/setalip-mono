'use server';
import { LocationService } from '@repo/shared/service';
import {
  FormDeleteFacilityImage,
  DeleteFacilityImageSchema,
  deleteFacilityImageSchema,
} from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { container, TYPES } from '@repo/shared/inversify';

export async function deleteFacilityImage(
  state: FormDeleteFacilityImage,
  data: FormData,
): Promise<FormDeleteFacilityImage> {
  const formData = convertFormData<DeleteFacilityImageSchema>(data);
  const parsed = deleteFacilityImageSchema.safeParse(formData);

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

  const deleteFacilityImage = await locationService.deleteFacilityImage(
    parsed.data.facilityId,
  );

  if (deleteFacilityImage.error) {
    return {
      form: undefined,
      status: 'error',
      errors: deleteFacilityImage.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
