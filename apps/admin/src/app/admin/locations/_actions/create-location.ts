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
import { createLocationSchema, FormCreateLocation } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';
import { FieldError } from 'react-hook-form';
import { api } from '@/trpc/server';

export async function createLocation(
  state: FormCreateLocation,
  data: FormData,
): Promise<FormCreateLocation> {
  const formData = convertFormData(data);
  const parsed = createLocationSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const parsedPhoneNumber = parsePhoneNumber(parsed.data.phoneNumber);
  const formattedPhoneNumber = `+${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  const locationService = container.get<LocationService>(TYPES.LocationService);

  const updateLocation = await locationService.create({
    name: parsed.data.name,
    phone_number: formattedPhoneNumber,
    email: parsed.data.email,
    address: parsed.data.address,
    link_maps: parsed.data.linkMaps,
  });

  if (updateLocation.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: updateLocation.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
