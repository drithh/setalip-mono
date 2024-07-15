'use server';
import {
  LocationService,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editFacilitySchema, FormEditFacility } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function editFacility(
  state: FormEditFacility,
  data: FormData,
): Promise<FormEditFacility> {
  const formData = convertFormData(data);
  const parsed = editFacilitySchema.safeParse(formData);

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
      ? await api.file.upload({ files: parsed.data.file })
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

  const locationService = container.get<LocationService>(TYPES.LocationService);

  const facility = await locationService.updateFacility({
    id: parsed.data.facilityId ?? 0,
    name: parsed.data.name,
    capacity: parsed.data.capacity,
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
