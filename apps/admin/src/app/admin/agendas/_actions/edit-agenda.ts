'use server';
import {
  AgendaService,
} from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editAgendaSchema, FormEditAgenda } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function editAgenda(
  state: FormEditAgenda,
  data: FormData,
): Promise<FormEditAgenda> {
  const formData = convertFormData(data);
  const parsed = editAgendaSchema.safeParse(formData);

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

  const result = await agendaService.update({
    id: parsed.data.id,
    time: parsed.data.time,
    class_id: parsed.data.class_id,
    coach_id: parsed.data.coach_id,
    location_facility_id: parsed.data.location_facility_id,
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
