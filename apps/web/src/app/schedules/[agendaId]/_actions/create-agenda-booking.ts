'use server';
import { container, TYPES } from '@repo/shared/inversify';
import { AgendaService } from '@repo/shared/service';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

import { validateUser } from '@/lib/auth';

import {
  createAgendaBookingSchema,
  FormCreateAgendaBooking,
} from '../form-schema';

export async function createAgendaBooking(
  state: FormCreateAgendaBooking,
  data: FormData,
): Promise<FormCreateAgendaBooking> {
  const auth = await validateUser();

  const formData = convertFormData(data);
  const parsed = createAgendaBookingSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);

  if (
    parsed.data.agenda_id === undefined &&
    parsed.data.agenda_recurrence_id === 0
  ) {
    return {
      form: parsed.data,
      status: 'error',
      errors: 'Agenda and time are required',
    };
  }

  const result = await agendaService.createAgendaBooking({
    user_id: auth.user.id,
    agenda_id: parsed.data.agenda_id,
    time: parsed.data.time,
    agenda_recurrence_id: parsed.data.agenda_recurrence_id,
  });

  if (result.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: result.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
