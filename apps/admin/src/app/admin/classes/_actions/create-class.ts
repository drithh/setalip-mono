'use server';
import { ClassService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createClassSchema, FormCreateClass } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';

export async function createClass(
  state: FormCreateClass,
  data: FormData,
): Promise<FormCreateClass> {
  const formData = convertFormData(data);
  const parsed = createClassSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const classService = container.get<ClassService>(TYPES.ClassService);

  const createClass = await classService.create({
    name: parsed.data.name,
    class_type_id: parsed.data.class_type_id,
    description: parsed.data.description,
    duration: parsed.data.duration,
    slot: parsed.data.slot,
  });

  if (createClass.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: createClass.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
