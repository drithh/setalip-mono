import { FormState } from '@repo/shared/form';
import { InsertAgenda } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createAgendaSchema = z.object({
  time: z.coerce.date(),
  class_id: z.coerce.number(),
  coach_id: z.coerce.number(),
  location_facility_id: z.coerce.number(),

  is_show: z.coerce.number().refine((v) => v === 0 || v === 1),
}) satisfies ZodType<InsertAgenda>;

export type CreateAgendaSchema = z.infer<typeof createAgendaSchema>;
export type FormCreateAgenda = FormState<CreateAgendaSchema>;

export const editAgendaSchema = createAgendaSchema.extend({
  id: z.coerce.number().optional(),
  agenda_recurrence_id: z.coerce.number().optional(),
});

export type EditAgendaSchema = z.infer<typeof editAgendaSchema>;
export type FormEditAgenda = FormState<EditAgendaSchema>;

export const editParticipantSchema = z.object({
  agenda_id: z.coerce.number(),
  participants: z.array(
    z.object({
      agenda_booking_id: z.number().optional(),
      user_id: z.coerce.number(),
      delete: z.enum(['refund', 'no_refund']).optional(),
    }),
  ),
});

export type EditParticipantSchema = z.infer<typeof editParticipantSchema>;
export type FormEditParticipant = FormState<EditParticipantSchema>;
