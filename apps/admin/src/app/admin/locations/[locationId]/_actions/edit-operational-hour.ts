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
import {
  editOperationalHourSchema,
  FormEditOperationalHour,
} from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
  transformData,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';
import { FieldError } from 'react-hook-form';
import { api } from '@/trpc/server';

export async function editOperationalHour(
  state: FormEditOperationalHour,
  data: FormData,
): Promise<FormEditOperationalHour> {
  const formData = convertFormData(data);

  const operationalHourRegex = /^operationalHour\.(\d+)\.(\w+)$/;
  const transformedData = transformData(formData, operationalHourRegex);

  const newFormData = {
    ...formData,
    operationalHour: transformedData,
  };

  const parsed = editOperationalHourSchema.safeParse(newFormData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const updateOperationalHour = await locationService.updateOperationalHour({
    location_id: parsed.data.locationId,
    operationalHours: parsed.data.operationalHour
      .filter((operationalHour) => operationalHour.check)
      .map((operationalHour) => ({
        location_id: parsed.data.locationId,
        id: operationalHour.operationalHourId,
        day_of_week: operationalHour.day,
        opening_time: operationalHour.openingTime,
        closing_time: operationalHour.closingTime,
      })),
  });

  if (updateOperationalHour.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: updateOperationalHour.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
