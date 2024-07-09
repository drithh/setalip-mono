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
    .default(1)
    .optional(),
  per_page: z.coerce
    .number()
    .refine((data) => data > 0)
    .default(10)
    .optional(),
  sort: z.string().default('created_at.desc').optional(),
});

export const findAllPackageSchema = defaultPaginationSchema.extend({
  name: z.string().optional(),
  class_type_id: z.string().optional(),
});

export const findAllPackageTransactionSchema = defaultPaginationSchema.extend({
  user_name: z.string().optional(),
  status: z.string().optional(),
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
  class_name: z.string().optional(),
  coach_name: z.string().optional(),
  location_name: z.string().optional(),
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

export const findAllCoachAgendaSchema = defaultPaginationSchema.extend({
  class_type_name: z.string().optional(),
  coach_name: z.string().optional(),
  location_name: z.string().optional(),
  sort: z.string().default('time.desc'),
});

export const findAllUserCreditSchema = defaultPaginationSchema.extend({
  type: z.string().optional(),
});

export const findAllLoyaltySchema = defaultPaginationSchema.extend({
  type: z.string().optional(),
  user_name: z.string().optional(),
});

export const findAllUserLoyaltySchema = defaultPaginationSchema.extend({
  type: z.string().optional(),
});

export const findAllPackageTransactionByUserIdSchema =
  defaultPaginationSchema.extend({
    status: z.string().optional(),
  });

export const findAllDepositAccountSchema = defaultPaginationSchema.extend({
  name: z.string().optional(),
});

export const deleteCarouselSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const deleteDepositAccountSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const findAllReviewSchema = defaultPaginationSchema.extend({
  email: z.string().optional(),
});

export const deleteReviewSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const findAllFrequentlyAskedQuestionSchema =
  defaultPaginationSchema.extend({
    question: z.string().optional(),
  });

export const deleteFrequentlyAskedQuestionSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const findAllDepositReviewFaqSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  question: z.string().optional(),
});

export const updateAgendaBookingSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
  status: z.string(),
});

export const findAllVoucherSchema = defaultPaginationSchema.extend({
  name: z.string().optional(),
  code: z.string().optional(),
  types: z.string().optional(),
});

export const findVoucherByCodeSchema = z.object({
  code: z.string(),
});

export const deleteVoucherSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});
