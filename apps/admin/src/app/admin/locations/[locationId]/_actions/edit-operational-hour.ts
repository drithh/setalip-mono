'use server';
import {
  LocationService,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  editOperationalHourSchema,
  FormEditOperationalHour,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
  transformData,
} from '@repo/shared/util';

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
