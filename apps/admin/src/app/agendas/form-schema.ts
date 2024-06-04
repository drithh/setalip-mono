import { FormState } from '@repo/shared/form';
import { InsertAgenda } from '@repo/shared/repository';
import { ZodType, z } from 'zod';

export const createAgendaSchema = z.object({
  slot: z.coerce.number(),
  time: z.coerce.date(),
  class_id: z.coerce.number(),
  coach_id: z.coerce.number(),
  location_facility_id: z.coerce.number(),
}) satisfies ZodType<InsertAgenda>;

export type CreateAgendaSchema = z.infer<typeof createAgendaSchema>;
export type FormCreateAgenda = FormState<CreateAgendaSchema>;

export const editParticipantSchema = z.object({
  agenda_id: z.coerce.number(),
  participants: z.array(
    z.object({
      agenda_booking_id: z.coerce.number(),
      user_id: z.coerce.number(),
    }),
  ),
});

export type EditParticipantSchema = z.infer<typeof editParticipantSchema>;
export type FormEditParticipant = FormState<EditParticipantSchema>;
