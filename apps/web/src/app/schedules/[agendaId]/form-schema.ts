import { FormState } from '@repo/shared/form';
import { z } from 'zod';

export const createAgendaBookingSchema = z.object({
  agenda_id: z.coerce.number(),
  time: z.coerce.date(),
  agenda_recurrence_id: z.coerce.number(),
});

export type CreateAgendaBookingSchema = z.infer<
  typeof createAgendaBookingSchema
>;
export type FormCreateAgendaBooking = FormState<CreateAgendaBookingSchema>;
