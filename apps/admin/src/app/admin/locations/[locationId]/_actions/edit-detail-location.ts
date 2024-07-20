'use server';
import { LocationService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  editDetailLocationSchema,
  FormEditDetailLocation,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';

export async function editDetailLocation(
  state: FormEditDetailLocation,
  data: FormData,
): Promise<FormEditDetailLocation> {
  const formData = convertFormData(data);
  const parsed = editDetailLocationSchema.safeParse(formData);

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

  const updateLocation = await locationService.update({
    id: parsed.data.locationId,
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
