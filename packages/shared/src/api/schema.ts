import { z } from 'zod';

export const fileUploadSchema = z.object({
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

export const deleteLocationSchema = z.object({
  locationId: z.coerce.number().refine((data) => data > 0),
});

export const deleteLocationAssetSchema = z.object({
  assetId: z.coerce.number().refine((data) => data > 0),
});

export const deleteFacilitySchema = z.object({
  facilityId: z.coerce.number(),
});

export const findAllPackageSchema = z.object({
  page: z.coerce
    .number()
    .refine((data) => data > 0)
    .default(1),
  per_page: z.coerce
    .number()
    .refine((data) => data > 0)
    .default(10),
  sort: z.string().default('created_at.asc'),
  name: z.string().optional(),
  class_type_id: z.string().optional(),
});
