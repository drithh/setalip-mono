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
  level: z.coerce.number(),
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
  level: z.coerce.number(),
  locationId: z.coerce.number(),
  file: z.custom<File | null>((data) => {
    return data === null || data instanceof File;
  }, 'Data is not an instance of a File'),
});

export type EditFacilitySchema = z.infer<typeof editFacilitySchema>;
export type FormEditFacility = FormState<EditFacilitySchema>;

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
