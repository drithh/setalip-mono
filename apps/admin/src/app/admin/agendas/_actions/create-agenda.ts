'use server';
import { cookies } from 'next/headers';
import {
  AuthService,
  ClassTypeService,
  AgendaService,
  UserValidationError,
} from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createAgendaSchema, FormCreateAgenda } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function createAgenda(
  state: FormCreateAgenda,
  data: FormData,
): Promise<FormCreateAgenda> {
  const formData = convertFormData(data);
  const parsed = createAgendaSchema.safeParse(formData);

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

  const result = await agendaService.create({
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
