import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const editFacilitySchema = z.object({
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

export const deleteLocationAssetSchema = z.object({
  assetId: z.coerce.number().refine((data) => data > 0),
});

export type DeleteLocationAssetSchema = z.infer<
  typeof deleteLocationAssetSchema
>;
export type FormDeleteLocationAsset = FormState<DeleteLocationAssetSchema>;

export const deleteFacilityImageSchema = z.object({
  facilityId: z.coerce.number(),
});

export type DeleteFacilityImageSchema = z.infer<
  typeof deleteFacilityImageSchema
>;

export type FormDeleteFacilityImage = FormState<DeleteFacilityImageSchema>;
