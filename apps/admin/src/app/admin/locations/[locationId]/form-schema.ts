import { FormState } from '@repo/shared/form';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const editDetailLocationSchema = z.object({
  locationId: z.coerce.number(),
  name: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  phoneNumber: z.string().refine((data) => isPossiblePhoneNumber(data), {
    message: 'Invalid phone number',
  }),
  email: z.string().email(),
  linkMaps: z.string().url(),
});

export type EditDetailLocationSchema = z.infer<typeof editDetailLocationSchema>;
export type FormEditDetailLocation = FormState<EditDetailLocationSchema>;

export const createFacilitySchema = z.object({
  name: z.string().min(3).max(255),
  capacity: z.coerce.number(),
  locationId: z.coerce.number(),
  file: z.custom<File | null>(
    (data) => data === null || data instanceof File,
    'Data is not an instance of a File',
  ),
});

export type CreateFacilitySchema = z.infer<typeof createFacilitySchema>;
export type FormCreateFacility = FormState<CreateFacilitySchema>;

export const editFacilitySchema = z.object({
  facilityId: z.coerce.number(),
  name: z.string().min(3).max(255),
  capacity: z.coerce.number(),
  locationId: z.coerce.number(),
  file: z.custom<File | null>((data) => {
    return data === null || data instanceof File;
  }, 'Data is not an instance of a File'),
  image_url: z.string().url().optional(),
});

export type EditFacilitySchema = z.infer<typeof editFacilitySchema>;
export type FormEditFacility = FormState<EditFacilitySchema>;

const compareTime = (openingTime: string, closingTime: string) => {
  const [openingHour, openingMinute, openingSecond] = openingTime
    .split(':')
    .map(Number);
  const [closingHour, closingMinute, closingSecond] = closingTime
    .split(':')
    .map(Number);
  if (
    openingHour === undefined ||
    openingMinute === undefined ||
    openingSecond === undefined ||
    closingHour === undefined ||
    closingMinute === undefined ||
    closingSecond === undefined
  ) {
    return false;
  }
  if (openingHour > closingHour) {
    return false;
  } else if (openingHour === closingHour) {
    if (openingMinute > closingMinute) {
      return false;
    }
  }
  return true;
};

export const editOperationalHourSchema = z.object({
  locationId: z.coerce.number(),
  operationalHour: z.array(
    z
      .object({
        operationalHourId: z.coerce.number().optional(),
        day: z.coerce.number().min(0).max(6),
        check: z.coerce.boolean(),
        openingTime: z
          .string()
          .regex(/^\d{2}:\d{2}:\d{2}$/)
          .refine((data) => data.length === 8),
        closingTime: z
          .string()
          .regex(/^\d{2}:\d{2}:\d{2}$/)
          .refine((data) => data.length === 8),
      })
      .refine((data) => {
        return (
          data.check !== true || compareTime(data.openingTime, data.closingTime)
        );
      }, 'Opening time must be less than closing time'),
  ),
});

export type EditOperationalHourSchema = z.infer<
  typeof editOperationalHourSchema
>;
export type FormEditOperationalHour = FormState<EditOperationalHourSchema>;

export const uploadLocationAssetSchema = z.object({
  locationId: z.coerce.number(),
  files: z.custom<File[] | File>((data) => {
    if (!Array.isArray(data)) {
      return data instanceof File;
    }
    for (const file of data) {
      if (!(file instanceof File)) {
        return false;
      }
    }
    return true;
  }, 'Data is not an instance of a File'),
});

export type UploadLocationAssetSchema = z.infer<
  typeof uploadLocationAssetSchema
>;
export type FormUploadLocationAsset = FormState<UploadLocationAssetSchema>;
