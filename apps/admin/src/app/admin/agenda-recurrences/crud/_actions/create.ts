'use server';
import { AgendaService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createSchema, FormCreate } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function create(
  state: FormCreate,
  data: FormData,
): Promise<FormCreate> {
  const formData = convertFormData(data);
  const parsed = createSchema.safeParse(formData);

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

  const result = await agendaService.createAgendaRecurrence({
    time: parsed.data.time,
    day_of_week: parsed.data.day_of_week,
    class_id: parsed.data.class_id,
    coach_id: parsed.data.coach_id,
    location_facility_id: parsed.data.location_facility_id,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date,
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
