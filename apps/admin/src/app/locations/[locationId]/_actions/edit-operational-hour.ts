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
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';
import { FieldError } from 'react-hook-form';
import { api } from '@/trpc/server';

function transformData<T = number | string | Date | boolean>(
  data: Record<string, T>,
) {
  const operationalHours: Record<string, T>[] = [];
  const operationalHourRegex = /^operationalHour\.(\d+)\.(\w+)$/;

  for (const key in data) {
    const match = key.match(operationalHourRegex);
    if (match) {
      const [, index, field] = match as any;
      if (!operationalHours[index]) {
        operationalHours[index] = {};
      }
      (operationalHours[index] as any)[field] = data[key];
    }
  }

  return operationalHours;
}

export async function editOperationalHour(
  state: FormEditOperationalHour,
  data: FormData,
): Promise<FormEditOperationalHour> {
  const formData = convertFormData(data);

  const transformedData = transformData(formData);
  console.log('transformedData', transformedData);

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
