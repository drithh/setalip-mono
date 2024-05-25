'use server';
import { cookies } from 'next/headers';
import {
  AuthService,
  LocationService,
  UserValidationError,
} from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createFacilitySchema, FormCreateFacility } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function createFacility(
  state: FormCreateFacility,
  data: FormData,
): Promise<FormCreateFacility> {
  const formData = convertFormData(data);
  const parsed = createFacilitySchema.safeParse(formData);

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
      : [{ url: '', name: '' }];

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

  const facility = await locationService.createFacility({
    location_id: parsed.data.locationId,
    name: parsed.data.name,
    level: parsed.data.level,
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
