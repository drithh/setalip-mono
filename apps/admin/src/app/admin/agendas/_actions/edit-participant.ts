'use server';
import { AgendaService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editParticipantSchema, FormEditParticipant } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
  transformData,
} from '@repo/shared/util';

export async function editParticipant(
  state: FormEditParticipant,
  data: FormData,
): Promise<FormEditParticipant> {
  const formData = convertFormData(data);

  const participantRegex = /^participants\.(\d+)\.(\w+)$/;
  const transformedData = transformData(formData, participantRegex);

  const newFormData = {
    ...formData,
    participants: transformedData,
  };

  const parsed = editParticipantSchema.safeParse(newFormData);

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

  const result = await agendaService.updateAgendaBookingParticipant({
    agenda_id: parsed.data.agenda_id,
    agendaBookings: parsed.data.participants.map((participant) => ({
      id: participant.agenda_booking_id,
      user_id: participant.user_id,
      name: '',
      delete: participant.delete,
    })),
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
