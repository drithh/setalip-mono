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

export const findAllFacilityByIdSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
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

export const defaultPaginationSchema = z.object({
  page: z.coerce
    .number()
    .refine((data) => data > 0)
    .default(1),
  per_page: z.coerce
    .number()
    .refine((data) => data > 0)
    .default(10),
  sort: z.string().default('created_at.asc'),
});

export const findAllPackageSchema = defaultPaginationSchema.extend({
  name: z.string().optional(),
  class_type_id: z.string().optional(),
});

export const deletePackageSchema = z.object({
  packageId: z.coerce.number().refine((data) => data > 0),
});

export const findAllUserSchema = defaultPaginationSchema.extend({
  name: z.string().optional(),
  role: z.string().optional(),
});

export const findCreditsByUserIdSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const findAllAgendaSchema = defaultPaginationSchema.extend({
  className: z.string().optional(),
  coach: z.string().optional(),
  location: z.string().optional(),
  dateStart: z.date().optional(),
  dateEnd: z.date().optional(),
});

export const deleteParticipantSchema = z.object({
  participantId: z.coerce.number().refine((data) => data > 0),
});

export const findAllScheduleSchema = defaultPaginationSchema.extend({
  class_type_name: z.string().optional(),
  coach_name: z.string().optional(),
  location_name: z.string().optional(),
  class_name: z.string().optional(),
  date: z.string().optional(),
  sort: z.string().default('time.asc'),
});

export const findAllUserAgendaSchema = defaultPaginationSchema.extend({
  class_type_name: z.string().optional(),
  coach_name: z.string().optional(),
  location_name: z.string().optional(),
  sort: z.string().default('agenda_booking_updated_at.desc'),
});

export const findAllUserCreditSchema = defaultPaginationSchema.extend({
  type: z.string().optional(),
});

export const findAllUserLoyaltySchema = defaultPaginationSchema.extend({
  type: z.string().optional(),
});

export const findAllPackageTransactionByUserIdSchema =
  defaultPaginationSchema.extend({
    status: z.string().optional(),
  });
