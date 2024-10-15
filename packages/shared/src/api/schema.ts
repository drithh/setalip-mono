import { z } from 'zod';
import { DeleteAgenda } from '../service';

export const cronSchema = z.object({
  secret: z.string(),
});

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

export const fileUploadLocalSchema = fileUploadSchema.extend({
  folder: z.string(),
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

export const deleteClassSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const deleteClassAssetSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
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

export const findAllStatisticSchema = defaultPaginationSchema.extend({
  role: z.string().optional(),
});

export const deleteStatisticSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
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

export const findAllAgendaBookingByMonthAndLocationSchema = z.object({
  location_id: z.coerce.number().default(1),
  date: z.coerce.date().default(new Date()),
});

export const findAllAgendaSchema = defaultPaginationSchema.extend({
  class_name: z.string().optional(),
  coach_name: z.string().optional(),
  location_name: z.string().optional(),
  date: z.string().optional(),
});

export const findAllAgendaRecurrenceSchema = defaultPaginationSchema.extend({
  coach_name: z.string().optional(),
  location_name: z.string().optional(),
  day_of_week: z.coerce.number().default(0).optional(),
});

export const deleteParticipantSchema = z.object({
  participantId: z.coerce.number().refine((data) => data > 0),
});

export const deleteAgendaSchema = z.object({
  id: z.coerce.number().optional(),
  agenda_recurrence_id: z.coerce.number().nullable(),
  time: z.coerce.date(),
  coach_id: z.coerce.number(),
  location_facility_id: z.coerce.number(),
  class_id: z.coerce.number(),
  is_refund: z.boolean(),
}) satisfies z.ZodType<DeleteAgenda>;

export const deleteAgendaRecurrenceSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const insertAgendaBookingAdminSchema = z.object({
  agenda_id: z.coerce.number().optional(),
  user_id: z.coerce.number().refine((data) => data > 0),
  used_credit_user_id: z.coerce.number().refine((data) => data > 0),
  time: z.coerce.date(),
  agenda_recurrence_id: z.coerce.number(),
});

export const deleteAgendaBookingSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
  type: z.enum(['refund', 'no_refund']),
});

export const cancelAgendaSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
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

export const findAllLoyaltyRewardSchema = defaultPaginationSchema.extend({});
export const findAllLoyaltyShopSchema = defaultPaginationSchema.extend({});

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

export const deleteLoyaltyRewardSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});

export const deleteLoyaltyShopSchema = z.object({
  id: z.coerce.number().refine((data) => data > 0),
});
