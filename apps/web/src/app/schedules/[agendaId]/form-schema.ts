import { FormState } from '@repo/shared/form';
import { SelectUser } from '@repo/shared/repository';
import { z } from 'zod';

export const createAgendaBookingSchema = z.object({
  agenda_id: z.coerce.number(),
});

export type CreateAgendaBookingSchema = z.infer<
  typeof createAgendaBookingSchema
>;
export type FormCreateAgendaBooking = FormState<CreateAgendaBookingSchema>;
