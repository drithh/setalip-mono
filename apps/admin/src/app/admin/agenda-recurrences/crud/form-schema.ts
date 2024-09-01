import { FormState } from '@repo/shared/form';
import {
  InsertAgendaRecurrence,
} from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createSchema = z.object({
  time: z.string(),
  day_of_week: z.coerce.number(),
  class_id: z.coerce.number(),
  coach_id: z.coerce.number(),
  location_facility_id: z.coerce.number(),
}) satisfies ZodType<InsertAgendaRecurrence>;

export type CreateSchema = z.infer<typeof createSchema>;
export type FormCreate = FormState<CreateSchema>;

export const editSchema = createSchema.extend({
  id: z.coerce.number(),
});

export type EditSchema = z.infer<typeof editSchema>;
export type FormEdit = FormState<EditSchema>;
