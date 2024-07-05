'use server';
import { cookies } from 'next/headers';
import { ClassTypeService, AgendaService } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import {
  createAgendaBookingSchema,
  FormCreateAgendaBooking,
} from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { validateUser } from '@/lib/auth';

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

  const voucher = 0;

  const result = await agendaService.createAgendaBooking({
    user_id: auth.user.id,
    agenda_id: parsed.data.agenda_id,
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
